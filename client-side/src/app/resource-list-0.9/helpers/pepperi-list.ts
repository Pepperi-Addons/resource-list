import { ReplaySubject, Subject } from "rxjs";
import { ClientEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";
import { ListContainer, ListState, DataRow, List } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { ViewBlocksAdapterFactory } from "./view-blocks-adapters/view-blocks-adapter";
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { LayoutObserver } from "./layout-observer";
import { StateObserver } from "./state-observer";
import { ListDataSource } from "./list-data-source";
import { GenericListAdapterResult } from "../metadata";



export interface IListDataSource extends IPepGenericListDataSource{
    subscribeToLayoutChanges(): LayoutObserver
    subscribeToStateChanges(): StateObserver
    subscribeToDataSource(cb: (ds: IPepGenericListDataSource) => void): void
    onMenuClick(key: string): Promise<PepperiList>
}

export interface IStateChangedHandler{
    onListEvent(params: IPepGenericListParams, isFirstEvent?: boolean): Promise<IPepGenericListInitData>
}

/**
 * this class responding to events from the client component such as onDataSourceInit, onMenuClicked and so on..
 * this class will respond to this events by emitting events to the cpi side and adapt the result.
 * this class will also hold state manager in order to send the cpi side events the state changes
 */

export class PepperiList implements IStateChangedHandler{
    private layoutObserver: LayoutObserver = new LayoutObserver()
    private items: DataRow[]
    private dataView: IPepGenericListInitData['dataView']
    private count: number
    private $dataSource: ReplaySubject<IPepGenericListDataSource> = new ReplaySubject()
    private stateManager: StateManager
    private listContainer: ListContainer
    constructor(private clientEventsService: ClientEventsService, private changes?: ListState, private list?: List){
        this.stateManager = new StateManager(undefined)
        this.$dataSource.next(new ListDataSource(this))
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
            return await this.clientEventsService.emitLoadListEvent(undefined, changes, this.list)
        }
        return await this.clientEventsService.emitStateChangedEvent(state, changes, this.list)
    }

    private convertToListLayout(listContainer: ListContainer): GenericListAdapterResult{
        const lineMenuSubject = new Subject<{key: string, data?: any}>()
        lineMenuSubject.subscribe((event) => this.onClientLineMenuClick(event.key, event.data))
        const genericListAdapter = new GenericListAdapter(listContainer, lineMenuSubject)
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

    async onMenuClick(key: string){
        const listContainer = await this.clientEventsService.emitMenuClickEvent(this.stateManager.getState(), key, this.list)
        //update the state if needed
        Object.assign(this.listContainer.State, listContainer.State || {})
        //update the layout if needed
        Object.assign(this.listContainer.Layout, listContainer.State || {})

        if(listContainer.Data){
            this.listContainer.Data = listContainer.Data
        }
        //update the data source on the ui component
        this.$dataSource.next(new ListDataSource(this))
    }

    private onClientLineMenuClick(key: string, data?: any){
        console.log('menu clicked!!')
    }

    isStateChanged(changes: Partial<ListState>){
        return Object.keys(changes).length > 0
    }

    async onListEvent(params: IPepGenericListParams): Promise<IPepGenericListInitData>{
        let listContainer: ListContainer = this.listContainer
        const state = this.stateManager.getState()

        //if we don't have a state then its load list event and we don't need to build the changes from the params
        const changes = state? this.stateManager.buildChangesFromPageParams(params): this.changes
        listContainer = await this.getListContainer(changes)

        //update all observers
        this.updateList(listContainer)

        return {
            dataView: this.dataView,
            items: this.items,
            totalCount: this.count
        }
    }

    updateList(listContainer: ListContainer){
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
}
