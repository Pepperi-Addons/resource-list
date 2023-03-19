import { ReplaySubject, Subject } from "rxjs";
import { ClientEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";
import { ListContainer, ListState, DataRow } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { GridViewBlockAdapter, ViewBlocksAdapterFactory } from "./view-blocks-adapter";
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
    private stateManager: StateManager = new StateManager({})
    
    constructor(private clientEventsService: ClientEventsService,  private listContainer: Required<ListContainer>){
        this.$dataSource.next(new ListDataSource(this))
        this.updateList(listContainer)
    }

    subscribeToStateChanges(): StateObserver {
        return this.stateManager.getStateObserver()
    }

    subscribeToDataSource(cb: (ds: IPepGenericListDataSource) => void){
        this.$dataSource.subscribe(cb)
    }

    private async getListContainer(changes: Partial<ListState>){
        const state = this.stateManager.getState()
        return await this.clientEventsService.emitStateChangedEvent(state, changes)
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
        const listContainer = await this.clientEventsService.emitMenuClickEvent(this.stateManager.getState(), key)
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

    async onListEvent(params: IPepGenericListParams, isFirstEvent?: boolean): Promise<IPepGenericListInitData>{
        let listContainer: ListContainer = this.listContainer
        //in case of first init the container already updated
        if(!isFirstEvent){
            const changes = this.stateManager.buildChangesFromPageParams(params)
            listContainer = await this.getListContainer(changes)
        }
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
        //reset changes
    }
}
