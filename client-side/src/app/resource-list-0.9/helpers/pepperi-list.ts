import { ReplaySubject } from "rxjs";
import { ClientEventsService, ICPIEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";
import { ListContainer, ListState, DataRow, MenuBlock, List } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { ViewBlocksAdapterFactory } from "./view-blocks-adapters/view-blocks-adapter";
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { LayoutObserver } from "./layout-observer";
import { StateObserver } from "./state-observer";
import { ListDataSource } from "./list-data-source";
import { GenericListAdapterResult, ListEventResult } from "../metadata";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { ListActions } from "./list-actions";
import * as _ from "lodash";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { toApiQueryString } from "@pepperi-addons/pepperi-filters";


export interface IStateChangedHandler{
    onListEvent(params: IPepGenericListParams, isFirstEvent?: boolean): Promise<ListEventResult>
}

export interface ILineMenuHandler{
    onLineSelected(data: PepSelectionData): void
    onMenuClick(key: string, data?: PepSelectionData): Promise<void>
    getLineMenuBlocksArray(): MenuBlock[]
}

/**
 * this class responding to events from the client component such as onDataSourceInit, onMenuClicked and so on..
 * this class will respond to this events by emitting events to the cpi side and adapt the result.
 * this class will also hold state manager in order to send the cpi side events the state changes
 */

export class PepperiList implements IStateChangedHandler, ILineMenuHandler{
    private layoutObserver: LayoutObserver = new LayoutObserver();
    private $dataSource: ReplaySubject<IPepGenericListDataSource> = new ReplaySubject();
    private items: DataRow[];
    private stateManager: StateManager = new StateManager({});
    private listActions: ListActions;
    private $listActions: ReplaySubject<IPepGenericListActions> = new ReplaySubject();
    
    
    constructor(private clientEventsService: ICPIEventsService, private listContainer: ListContainer, private changes?: Partial<ListState>){
        this.stateManager = new StateManager(undefined)

        this.listActions = new ListActions(listContainer?.Layout?.LineMenu?.Blocks, this)
        this.$dataSource.next(new ListDataSource(this))
    }
    
    getLineMenuBlocksArray(){
        return this.listContainer?.Layout?.LineMenu?.Blocks || []
    }
    
    private isSelectedLinesChanged(data: PepSelectionData){
        const state = this.stateManager.getState()
        
        const listSelectedItems = data.rows
        const listSelectionType = data.selectionType == 0
        
        const stateSelectedItems = state.ItemSelection?.Items || []
        const stateSelectionType = state.ItemSelection?.SelectAll

        return stateSelectionType != listSelectionType ||
        !(stateSelectedItems.length == listSelectedItems.length && stateSelectedItems.every((item, index) => item == listSelectedItems[index]))


    }
    /**
     * this function invoked every time a line was selected.
     * the function will change the state of the list if selected lines was changed, and will build a new list
     * @param data the rows that were selected, and selectionType(if select all happen or not)
     * @returns void
     */
    async onLineSelected(data: PepSelectionData){
        if(!this.isSelectedLinesChanged(data)){
            return
        }
        //if the selected lines changed
        const changes: Partial<ListState> = {
            ItemSelection: {
                SelectAll: data.selectionType == 0,
                Items: data.rows
            }
        }

        const listContainer = await this.clientEventsService.emitStateChangedEvent(this.stateManager.getState(), changes, this.listContainer?.List)
        this.reloadList(listContainer)
    }

    subscribeToStateChanges(): StateObserver {
        return this.stateManager.getStateObserver()
    }
    
    subscribeToDataSource(cb: (ds: IPepGenericListDataSource) => void){
        this.$dataSource.subscribe(cb)
    }

    private async getListContainer(changes: Partial<ListState>){
        const state = this.stateManager.getState()
        if(!state){
            return await this.clientEventsService.emitLoadListEvent(undefined, changes, this.listContainer.List)
        }
        // if the changes is an empty object, don't emit state changed event
        else if(Object.keys(changes || {}).length > 0) {
            return await this.clientEventsService.emitStateChangedEvent(state, changes, this.listContainer.List)
        }
        return this.listContainer;
    }

    private convertToListLayout(listContainer: ListContainer): GenericListAdapterResult{
        const genericListAdapter = new GenericListAdapter(listContainer, this)
        return genericListAdapter.adapt()
    }
    /**
     * 
     * @param listContainer 
     * this function updates the list container object and the state
     */
    private updatePepperiListProperties(listContainer: ListContainer){
        if(listContainer?.Data){
            this.listContainer.Data = listContainer.Data
        }
        this.listContainer.Layout = {...(this.listContainer.Layout || {}), ...(listContainer.Layout || {})}
        this.stateManager.updateState(listContainer.State)

    }

    //will expose the option to observe the changes on the layout by returning the observer as result
    subscribeToLayoutChanges(): LayoutObserver{
        return this.layoutObserver
    }

    subscribeToListActions(cb: (actions: IPepGenericListActions) => void): void{
        this.$listActions.subscribe(cb)
    }
    
    private reloadList(listContainer: ListContainer){
        //update the list layout
        this.updatePepperiListProperties(listContainer)
        //update the data source on the ui component
        this.$dataSource.next(new ListDataSource(this))
        this.$listActions.next(new ListActions(listContainer?.Layout?.LineMenu?.Blocks, this))
    }

    getListActions(): ListActions{
        return this.listActions
    }

    async onMenuClick(key: string, data?: PepSelectionData){
        const listContainer = await this.clientEventsService.emitMenuClickEvent(this.stateManager.getState(), key, this.listContainer.List, data)
        //reload the list
        this.reloadList(listContainer)
    }

    async onListEvent(params: IPepGenericListParams): Promise<ListEventResult>{
        const state = this.stateManager.getState()

        //if we don't have a state then its load list event and we don't need to build the changes from the params
        const changes = state? this.stateManager.buildChangesFromPageParams(params, this.listContainer?.Layout?.SmartSearch?.Fields || []): this.changes
        const listContainer = await this.getListContainer(changes)

        this.updatePepperiListProperties(listContainer)

        //adapt the data to be compatible to the generic list 
        const listData = this.convertToListLayout(listContainer)

        //notify observers 
        this.layoutObserver.notifyObservers(listData)

        //notify state observers 
        this.stateManager.notifyObservers()

        let dataView = listData.dataView

        //if the event didn't returned a dataview use the previous one
        if(!dataView){
            const viewBlocksAdapter = ViewBlocksAdapterFactory.create(this.listContainer.Layout.View.Type, this.listContainer.Layout.View.ViewBlocks.Blocks)
            dataView = viewBlocksAdapter.adapt()
        }
        const items = (this.listContainer?.Data?.Items || []).map(item => {
            return {
                fields: JSON.parse(JSON.stringify(item))
            }
        })
        this.updateSelectedLines(items);

        return {
            dataView: dataView,
            items: items,
            totalCount: this.listContainer?.Data?.Count,
            listData: listData
        }
    }
    
    //select the items base on the current state
    updateSelectedLines(items: DataRow[]){
        const state = this.stateManager.getState()
        const isAllSelected = state?.ItemSelection?.SelectAll || false
        const selectedItemsKeySet = new Set(state?.ItemSelection?.Items || [])
        //loop over the items and select the items that selected in the state (or )
        items?.forEach(item => {
            const isSelected = selectedItemsKeySet.has(item.fields['Key'] as string)
            //item is selected if not all the items selected and the item selected, or that all the the items selected and the item itself is not selected
            item.isSelected = (!isAllSelected && isSelected) || (isAllSelected && !isSelected)
            item.isEditable = true;
            item.isSelectableForActions = true;
        })
    }

    async onViewChanged(key: string){
        const listContainer = await this.clientEventsService.emitStateChangedEvent(this.stateManager.getState(), {ViewKey: key},  this.listContainer.List)
        //update the state if needed
        Object.assign(this.listContainer.State, listContainer.State || {})
        //update the layout if needed
        Object.assign(this.listContainer.Layout, listContainer.Layout || {})

        if(listContainer.Data){
            this.listContainer.Data = listContainer.Data
        }
        //update the data source on the ui component
        this.$dataSource.next(new ListDataSource(this))


    }
}
