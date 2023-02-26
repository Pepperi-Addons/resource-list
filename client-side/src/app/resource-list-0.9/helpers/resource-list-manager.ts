import { Subject } from "rxjs";
import { GenericListAdapterResult, SmartSearchInput } from "../metadata";
import { ViewBlocksAdapter } from "./view-blocks-adapter";
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { GVButton } from "src/app/generic-viewer/generic-viewer.model";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { ClientEventsService } from "../services/client-events.service";
import { ListContainer, ListData, ListState, Row } from "shared";
import { GenericListAdapter } from "./generic-list-adapter";
import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { GridDataView } from "@pepperi-addons/papi-sdk";
import { StateManager } from "./state-manager";

export class RLManager implements IPepGenericListDataSource{ 
    private $smartSearch: Subject<SmartSearchInput> = new Subject()
    private $menu: Subject<PepMenuItem[]> = new Subject()
    private $buttons: Subject<GVButton[]> = new Subject()
    private $lineMenu: Subject<LineMenuActionsObject> = new Subject()

    private dataView: GridDataView
    private items: Row[]
    private count: number
    inputs?: IPepGenericListListInputs;
    
    constructor(private clientEventsService: ClientEventsService, private stateManager: StateManager){
    
    }

    private buildChanges(params: IPepGenericListParams){
        debugger
        const state = this.stateManager.getState()
        const changes: Partial<ListState> = {}
        //if search string changed
        if(params.searchString != state.SearchString){
            changes.SearchString = params.searchString 
        }
        //if page index changed
        if(params.pageIndex != state.PageIndex){
            changes.PageIndex = params.pageIndex
        }
        //if sorting changed
        if(params.sorting?.isAsc !=  state.Sorting?.Ascending || params.sorting?.sortBy != state.Sorting?.FieldID){
            changes.Sorting = {
                Ascending: params.sorting.isAsc,
                FieldID: params.sorting?.sortBy
            }
        }
        return changes
    }
    private updateVariables(listContainer: ListContainer){
        if(listContainer.Data){
            this.items = listContainer.Data.Items
            this.count = listContainer.Data.Count
        }
        if(listContainer.Layout?.View?.ViewBlocks?.Blocks){
            const viewBlocksAdapter = new ViewBlocksAdapter(listContainer.Layout.View.ViewBlocks.Blocks)
            this.dataView = viewBlocksAdapter.adapt()
        }
    }

    getGenericListData(listContainer: ListContainer){
        const lineMenuSubject = new Subject<{key: string, data?: any}>()
        lineMenuSubject.subscribe((event) => this.onClientMenuClick(event.key, event.data))
        const genericListAdapter = new GenericListAdapter(listContainer, this.clientEventsService, lineMenuSubject)
        return genericListAdapter.adapt()
    }

    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
        //build changes 
        const changes = this.stateManager.buildChangesFromPageParams(params)

        //get the list container 
        const listContainer = await this.getListContainer(changes)

        //get generic list data
        const genericListData = this.getGenericListData(listContainer)

        //update the state
        if(listContainer.State){
            this.stateManager.setState(listContainer.State)
        }

        //update data view data and count
        this.updateVariables(listContainer)

        //notify observers 
        this.notifyObservers(genericListData, listContainer)

        //reset changes
        this.stateManager.resetChanges()
        //return updated data data view and count
        return {
            dataView: this.dataView,
            items: this.items,
            totalCount: this.count
        }
    }
    // private async updateList(changes: Partial<ListState>){
    //     const listContainer = await this.getListContainer(changes)
    //     this.changes = {}
    //     this.state = listContainer.State
    //     const lineMenuSubject = new Subject<{key: string, data?: any}>()
    //     lineMenuSubject.subscribe((event) => this.onClientMenuClick(event.key, event.data))
    //     const genericListAdapter = new GenericListAdapter(listContainer, this.clientEventsService, lineMenuSubject)
    //     const genericListData = genericListAdapter.adapt()
    //     this.notifyObservers(genericListData, listContainer)
    // }

    private async getListContainer(changes: Partial<ListState>){
        debugger
        const state = this.stateManager.getState()
        if(Object.keys(state).length == 0){
            return await this.clientEventsService.emitLoadListEvent(state, changes)
        }
        return await this.clientEventsService.emitStateChangedEvent(state, changes)
    }

    private notifyObservers(data: GenericListAdapterResult, listContainer: ListContainer){
        if(data.lineMenu){
            this.$lineMenu.next(data.lineMenu)
        }
        if(data.buttons){
            this.$buttons.next(data.buttons)
        }
        if(data.menu){
            this.$menu.next(data.menu)
        }
        if(data.smartSearch){
            this.$smartSearch.next(data.smartSearch)
        }
    }

    onSmartSearchChanged(cb: (data: SmartSearchInput) => void){
        this.$smartSearch.subscribe(cb)
        return this
    }

    onMenuChanged(cb: (data: PepMenuItem[]) => void){
        this.$menu.subscribe(cb)
        return this
    }

    onLineMenuChanged(cb: (data: LineMenuActionsObject) => void){
        this.$lineMenu.subscribe(cb)
        return this
    }

    onButtonsChanged(cb: (data: GVButton[]) => void){
        this.$buttons.subscribe(cb)
        return this
    }

    private onClientMenuClick(key: string, data?: any){
        console.log('menu clicked!!')
    }


}

interface LineMenuActionsObject {
    get: (data: PepSelectionData) => Promise<{title: string, handler: (selectedRows: any) => Promise<any>}[]>
}