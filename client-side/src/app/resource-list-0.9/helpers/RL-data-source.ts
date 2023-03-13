import { Subject } from "rxjs";
import { ClientEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";
import { ListContainer, ListState, DataRow } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { GridDataView } from "@pepperi-addons/papi-sdk";
import { GridViewBlockAdapter } from "./view-blocks-adapter";
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { LayoutObserver } from "./layout-observer";
import { ChangesBuilder } from "./changes-bulder";


export interface IRLDataSource extends IPepGenericListDataSource{
    subscribe(): LayoutObserver
}

/**
 * this class responding to events from the client component such as onDataSourceInit, onMenuClicked and so on..
 * this class will respond to this events by emitting events to the cpi side and adapt the result.
 * this class will also hold state manager in order to send the cpi side events the state changes
 */
export class RLDataSource implements IRLDataSource{
    private layoutObserver: LayoutObserver = new LayoutObserver()
    private items: DataRow[]
    private dataView: GridDataView
    private count: number

    constructor(private clientEventsService: ClientEventsService, private stateManager: StateManager){
    
    }

    private async getListContainer(changes: Partial<ListState>){
        const state = this.stateManager.getState()
        if(this.stateManager.isStateEmpty()){
            return await this.clientEventsService.emitLoadListEvent(undefined, this.stateManager.getChanges())
        }
        return await this.clientEventsService.emitStateChangedEvent(state, changes)
    }

    private getGenericListData(listContainer: ListContainer){
        const lineMenuSubject = new Subject<{key: string, data?: any}>()
        lineMenuSubject.subscribe((event) => this.onClientLineMenuClick(event.key, event.data))
        const genericListAdapter = new GenericListAdapter(listContainer, lineMenuSubject)
        return genericListAdapter.adapt()
    }
    
    private updateVariables(listContainer: ListContainer){
        if(listContainer.Data){
            this.items = listContainer.Data.Items
            this.count = listContainer.Data.Count
        }
        if(listContainer.Layout?.View?.ViewBlocks?.Blocks){
            const viewBlocksAdapter = new GridViewBlockAdapter(listContainer.Layout.View.ViewBlocks.Blocks)
            this.dataView = viewBlocksAdapter.adapt()
        }
    }
    //will expose the option to observe the changes on the layout by returning the observer as result
    subscribe(): LayoutObserver{
        return this.layoutObserver
    }

    private updateGenericListParams(params: IPepGenericListParams, state: Partial<ListState>){
        params.filters = state.SmartSearchQuery
        params.pageIndex = state.PageIndex
        params.searchString = state.SearchString
        if(state.Sorting){
            params.sorting = {
                sortBy: state.Sorting.FieldID,
                isAsc: state.Sorting.Ascending
            }
        }
    }

    private onClientLineMenuClick(key: string, data?: any){
        console.log('menu clicked!!')
    }
    
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData>{
        const paramsAdapter = new ChangesBuilder(params)
        const changes = paramsAdapter.build()
        //emit event to get the list container
        const listContainer = await this.getListContainer(changes)

        //adapt the data to be compatible to the generic list 
        const genericListData = this.getGenericListData(listContainer)

        //update the state 
        if(listContainer.State){
            this.stateManager.updateState(listContainer.State)
        }
        //update generic list params if needed
        this.updateGenericListParams(params, this.stateManager.getState())

        //update data view data and count
        this.updateVariables(listContainer)

        //notify observers 
        this.layoutObserver.notifyObservers(genericListData)

        //reset changes
        this.stateManager.resetChanges()

        return {
            dataView: this.dataView,
            items: this.items,
            totalCount: this.count
        }
    }
}
