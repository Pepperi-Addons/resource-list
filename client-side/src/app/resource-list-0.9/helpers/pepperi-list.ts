import { ReplaySubject } from "rxjs";
import { ICPIEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";
import { ListContainer, ListState, DataRow, MenuBlock } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { ViewBlocksAdapterFactory } from "./view-blocks-adapters/view-blocks-adapter";
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListEmptyState, IPepGenericListInitData, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { LayoutObserver } from "./layout-observer";
import { StateObserver } from "./state-observer";
import { ListDataSource } from "./list-data-source";
import { GenericListAdapterResult, ListEventResult } from "../metadata";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { ListActions } from "./list-actions";
import * as _ from "lodash";


export interface IStateChangedHandler{
    onListEvent(params: IPepGenericListParams, isFirstEvent?: boolean):Promise<IPepGenericListInitData>
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
    private stateManager: StateManager = new StateManager();
    private listActions: ListActions;
    private $listActions: ReplaySubject<IPepGenericListActions> = new ReplaySubject();
    private $errorMsg: ReplaySubject<IPepGenericListEmptyState> = new ReplaySubject();
    
    
    constructor(private clientEventsService: ICPIEventsService, private listContainer: ListContainer){
        this.listActions = new ListActions(listContainer?.Layout?.LineMenu?.Blocks, this)
        this.updateList(listContainer)
        this.$dataSource.next(new ListDataSource(this))
    }
    
    getLineMenuBlocksArray(){
        return this.listContainer?.Layout?.LineMenu?.Blocks || []
    }
    
    private isSelectedLinesChanged(data: PepSelectionData){
        
        const listSelectedItems = data.rows
        const listSelectionType = data.selectionType == 0
        
        const stateSelectedItems = this.listContainer.State.ItemSelection?.Items || []
        const stateSelectionType =  this.listContainer.State.ItemSelection?.SelectAll

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
        const listContainer = await this.clientEventsService.emitStateChangedEvent(this.listContainer.State, changes, this.listContainer?.List)
        //update the list and the observers
        this.updateList(listContainer)

        this.reloadListIfNeeded(listContainer)
        
    }

    subscribeToStateChanges(): StateObserver {
        return this.stateManager.getStateObserver()
    }
    
    subscribeToDataSource(cb: (ds: IPepGenericListDataSource) => void){
        this.$dataSource.subscribe(cb)
    }

    private async getListContainer(changes: Partial<ListState>){
        let result: ListContainer
        // if the changes is an empty object, don't emit state changed event
        if(Object.keys(changes || {}).length > 0) {
            result =  await this.clientEventsService.emitStateChangedEvent(this.listContainer.State, changes, this.listContainer.List) || {}
        }
        return result || this.listContainer || {};
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
        this.listContainer.State = {...(this.listContainer.State || {}), ...(listContainer.State || {})}

    }

    private notifyObservers(listData: GenericListAdapterResult){
        //notify observers 
        this.layoutObserver.notifyObservers(listData)

        //notify state observers 
        this.stateManager.notifyObservers(this.listContainer.State)
    }

    //will expose the option to observe the changes on the layout by returning the observer as result
    subscribeToLayoutChanges(): LayoutObserver{
        return this.layoutObserver
    }

    subscribeToListActions(cb: (actions: IPepGenericListActions) => void): void{
        this.$listActions.subscribe(cb)
    }
    
    private reloadListIfNeeded(listContainer: ListContainer){

        if(!this.isListNeedsToBeReload(listContainer)){
            return 
        }
        //update the data source on the ui component
        this.$dataSource.next(new ListDataSource(this))
        this.$listActions.next(new ListActions(listContainer?.Layout?.LineMenu?.Blocks, this))
    }
    /**
     * 
     * @param listContainer 
     * this function update the list container, and notify observers
     */
    private updateList(listContainer: ListContainer){
        this.updatePepperiListProperties(listContainer)

        //adapt the data to be compatible to the generic list 
        const listData = this.convertToListLayout(listContainer)
        
        //notify observers of layout and state
        this.notifyObservers(listData)
    }
    /**
     * 
     * @param listContainer 
     * this function returns true only if needs to reload the list.
     * the list needs to be reloaded iff data view is changed / items are changed / selection type is changed / line menu is changed
     */
    private isListNeedsToBeReload(listContainer: ListContainer){
        return listContainer?.Layout?.LineMenu || listContainer?.Layout?.View || listContainer?.Layout?.SelectionType || listContainer?.Data

    }

    getListActions(): ListActions{
        return this.listActions
    }

    async onMenuClick(key: string, data?: PepSelectionData){
        const listContainer = await this.clientEventsService.emitMenuClickEvent(this.listContainer.State, key, this.listContainer.List, data) || {}

        //update the list and the observers
        this.updateList(listContainer)

        //reload the list
        this.reloadListIfNeeded(listContainer)
    }

    async onListEvent(params: IPepGenericListParams, isFirstEvent: boolean): Promise<IPepGenericListInitData>{
        const changes = isFirstEvent? {} :this.stateManager.buildChangesFromPageParams(params, this.listContainer?.Layout?.SmartSearch?.Fields || [], this.listContainer.State)
        const listContainer = await this.getListContainer(changes)
        if(listContainer.ErrorMessage != undefined){
            this.$errorMsg.next({title: 'Error', description: listContainer.ErrorMessage, show: false})
            return {
                dataView: {Type: 'Grid', Fields: [], Context: {Profile: {Name: 'a'}, ScreenSize: 'Tablet', Name: 'a'},},
                items: [],
                totalCount: 0,
            }
        }
        this.updateList(listContainer)

        const viewBlocksAdapter = ViewBlocksAdapterFactory.create(this.listContainer.Layout.View.Type, this.listContainer.Layout.View.ViewBlocks.Blocks)
        const dataView = viewBlocksAdapter.adapt()

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
        }
    }
    
    //select the items base on the current state
    updateSelectedLines(items: DataRow[]){
        const isAllSelected = this.listContainer.State.ItemSelection?.SelectAll || false
        const selectedItemsKeySet = new Set(this.listContainer.State.ItemSelection?.Items || [])
        //loop over the items and select the items that selected in the state (or )
        items?.forEach(item => {
            const isSelected = selectedItemsKeySet.has(item.fields['Key'] as string)
            //item is selected if not all the items selected and the item selected, or that all the the items selected and the item itself is not selected
            item.isSelected = (!isAllSelected && isSelected) || (isAllSelected && !isSelected)
            item.isEditable = true;
            item.isSelectableForActions = true;
        })
    }

    subscribeToErrors(cb: (err: IPepGenericListEmptyState) => void): void{
        this.$errorMsg.subscribe(cb)
    }

    async onViewChanged(key: string){
        const listContainer = await this.getListContainer({ViewKey: key})
        //update the list
        this.updateList(listContainer)
        //reload
        this.reloadListIfNeeded(listContainer)
        
        
    }

    setTopScrollIndex(index: number){
        this.listContainer.State = {...(this.listContainer.State || {}), TopScrollIndex: index}
    }
}
