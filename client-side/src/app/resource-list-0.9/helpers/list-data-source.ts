import { Subject } from "rxjs";
import { ClientEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";
import { ListContainer, ListState, DataRow } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { GridDataView } from "@pepperi-addons/papi-sdk";
import { GridViewBlockAdapter } from "./view-blocks-adapter";
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { LayoutObserver } from "./layout-observer";
import { ChangesBuilder } from "./changes-builder";
import { StateObserver } from "./state-observer";


export interface IListDataSource extends IPepGenericListDataSource{
    subscribeToLayoutChanges(): LayoutObserver
    subscribeToStateChanges(): StateObserver
    onMenuClick(key: string): Promise<ListDataSource>
}

/**
 * this class responding to events from the client component such as onDataSourceInit, onMenuClicked and so on..
 * this class will respond to this events by emitting events to the cpi side and adapt the result.
 * this class will also hold state manager in order to send the cpi side events the state changes
 */
export class ListDataSource implements IListDataSource{
    private layoutObserver: LayoutObserver = new LayoutObserver()
    private items: DataRow[]
    private dataView: GridDataView
    private count: number
    public inputs?: IPepGenericListListInputs = {
        pager: {
            size: 50,
            type: 'pages'
        }
    }

    constructor(private clientEventsService: ClientEventsService, private stateManager: StateManager, private isCloned: boolean = false){
    
    }

    subscribeToStateChanges(): StateObserver {
        return this.stateManager.getStateObserver()
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
    subscribeToLayoutChanges(): LayoutObserver{
        return this.layoutObserver
    }

    async onMenuClick(key: string): Promise<ListDataSource>{
        const listContainer = await this.clientEventsService.emitMenuClickEvent(this.stateManager.getState(), key)
        this.updateList(listContainer)
        return this.clone()
    }
    private clone(): ListDataSource{
        const newDataSource = new ListDataSource(this.clientEventsService, this.stateManager, true)
        newDataSource.layoutObserver = this.layoutObserver
        newDataSource.dataView = this.dataView
        newDataSource.items = this.items
        newDataSource.count = this.count
        return newDataSource

    }

    private onClientLineMenuClick(key: string, data?: any){
        console.log('menu clicked!!')
    }
    async update(params: IPepGenericListParams): Promise<any[]> {
        await this.changeState(params)
        return this.items
    }

    private async changeState(params: IPepGenericListParams){
        const paramsAdapter = new ChangesBuilder(params)
        const changes = paramsAdapter.build()
        //emit event to get the list container
        const listContainer = await this.getListContainer(changes)
        //update the list and variables 
        this.updateList(listContainer)
    }
    
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData>{
        //if the list is just cloned there is no need to emit an event because the first init happen because the data source was cloned! and not because an event
        if(!this.isCloned){
            await this.changeState(params)
        }
        this.isCloned = false
        this.stateManager.updateVariables()
        return {
            dataView: this.dataView,
            items: this.items,
            totalCount: this.count
        }
    }

    updateList(listContainer: ListContainer){
        //adapt the data to be compatible to the generic list 
        const genericListData = this.getGenericListData(listContainer)

                //update the state 
                if(listContainer.State){
                    this.stateManager.updateState(listContainer.State)
                }
                //TODO update generic list state if needed
        
                //update data view data and count
                this.updateVariables(listContainer)
        
                //notify observers 
                this.layoutObserver.notifyObservers(genericListData)
        
                //reset changes
                this.stateManager.resetChanges()
    }
}
