import { ReplaySubject } from "rxjs";
import { ClientEventsService, ICPIEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";
import { ListContainer, ListState, DataRow } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { ViewBlocksAdapterFactory } from "./view-blocks-adapter";
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { LayoutObserver } from "./layout-observer";
import { StateObserver } from "./state-observer";
import { ListDataSource } from "./list-data-source";
import { GenericListAdapterResult } from "../metadata";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { ListActions } from "./list-actions";
import { PepRowData } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { debug } from "console";


export interface IStateChangedHandler{
    onListEvent(params: IPepGenericListParams, isFirstEvent?: boolean): Promise<IPepGenericListInitData>
}

export interface ILineMenuHandler{
    onLineSelected(data: PepSelectionData): void
    onMenuClick(key: string, data?: PepSelectionData): Promise<void>
}

/**
 * this class responding to events from the client component such as onDataSourceInit, onMenuClicked and so on..
 * this class will respond to this events by emitting events to the cpi side and adapt the result.
 * this class will also hold state manager in order to send the cpi side events the state changes
 */

export class PepperiList implements IStateChangedHandler, ILineMenuHandler{
    private layoutObserver: LayoutObserver = new LayoutObserver()
    private items: DataRow[]
    private dataView: IPepGenericListInitData['dataView']
    private count: number
    private $dataSource: ReplaySubject<IPepGenericListDataSource> = new ReplaySubject()
    private stateManager: StateManager = new StateManager({})
    private listActions: ListActions
    private $listActions: ReplaySubject<IPepGenericListActions> = new ReplaySubject()
    
    constructor(private clientEventsService: ICPIEventsService,  private listContainer: ListContainer, private resourceFields: AddonDataScheme['Fields']){
        this.listActions = new ListActions(listContainer?.Layout?.LineMenu?.Blocks, this)
        this.$dataSource.next(new ListDataSource(this))
        this.updateList(listContainer)
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

        const listContainer = await this.clientEventsService.emitStateChangedEvent(this.stateManager.getState(), changes)
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
        return await this.clientEventsService.emitStateChangedEvent(state, changes, this.listContainer.List)
    }

    private convertToListLayout(listContainer: ListContainer): GenericListAdapterResult{
        const genericListAdapter = new GenericListAdapter(listContainer, this)
        return genericListAdapter.adapt()
    }
    
    private updatePepperiListProperties(listContainer: ListContainer){
        if(listContainer.Data){
            this.items = listContainer.Data.Items
            this.count = listContainer.Data.Count
        }

        if(listContainer.Layout?.View?.ViewBlocks?.Blocks){
            const viewBlocksAdapter = ViewBlocksAdapterFactory.create(listContainer.Layout.View.Type, listContainer.Layout.View.ViewBlocks.Blocks)
            this.dataView = viewBlocksAdapter.adapt()
        }
    }

    //will expose the option to observe the changes on the layout by returning the observer as result
    subscribeToLayoutChanges(): LayoutObserver{
        return this.layoutObserver
    }

    subscribeToListActions(cb: (actions: IPepGenericListActions) => void): void{
        this.$listActions.subscribe(cb)
    }


    private reloadList(listContainer: ListContainer){
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

    async onMenuClick(key: string, data?: PepSelectionData){
        const listContainer = await this.clientEventsService.emitMenuClickEvent(this.stateManager.getState(), key, this.listContainer.List, data)
        //reload the list
        this.reloadList(listContainer)
    }

    isStateChanged(changes: Partial<ListState>){
        return Object.keys(changes).length > 0
    }

    async onListEvent(params: IPepGenericListParams, isFirstEvent?: boolean): Promise<IPepGenericListInitData>{
        let listContainer: ListContainer = this.listContainer
        //in case of first init the container already updated
        if(!isFirstEvent){
            const changes = this.stateManager.buildChangesFromPageParams(params, this.resourceFields)
            listContainer = await this.getListContainer(changes)
        }
        this.updateList(listContainer)
        return {
            dataView: this.dataView,
            items: this.items,
            totalCount: this.count
        }
    }

    updateListActions(listContainer: ListContainer){
        if(listContainer.Layout?.LineMenu?.Blocks){
            this.listActions = new ListActions(listContainer.Layout?.LineMenu?.Blocks, this)
            this.$listActions.next(this.listActions)
        }
    }

    updateList(listContainer: ListContainer){
        //update list actions
        this.updateListActions(listContainer)
        //adapt the data to be compatible to the generic list 
        const listData = this.convertToListLayout(listContainer)
        //update the state 
        if(listContainer.State){
            this.stateManager.updateState(listContainer.State)
        }
        //update data view data and count
        this.updatePepperiListProperties(listContainer)

        //notify observers 
        this.layoutObserver.notifyObservers(listData)

        //notify state observers 
        this.stateManager.notifyObservers()
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
