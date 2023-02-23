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

export class ResourceListDataSource implements IPepGenericListDataSource{ 
    private $smartSearch: Subject<SmartSearchInput> = new Subject()
    private $menu: Subject<PepMenuItem[]> = new Subject()
    private $buttons: Subject<GVButton[]> = new Subject()
    private $lineMenu: Subject<LineMenuActionsObject> = new Subject()

    private dataView: GridDataView
    private items: Row[]
    private count: number
    inputs?: IPepGenericListListInputs;
    
    constructor(private clientEventsService: ClientEventsService, private state: Partial<ListState> | undefined, private changes: Partial<ListState>){
    
    }

    private updateChanges(params: IPepGenericListParams){
        
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
        this.state = listContainer.State
        this.changes = {}
    }
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
        this.updateChanges(params)
        const listContainer = await this.getListContainer()
        this.updateVariables(listContainer)
        this.changes = {}
        this.state = listContainer.State
        const lineMenuSubject = new Subject<{key: string, data?: any}>()
        lineMenuSubject.subscribe((event) => this.onClientMenuClick(event.key, event.data))
        const genericListAdapter = new GenericListAdapter(listContainer, this.clientEventsService, lineMenuSubject)
        const genericListData = genericListAdapter.adapt()
        this.notifyObservers(genericListData, listContainer)
        // throw new Error('no implemented ')
        return {
            dataView: this.dataView,
            items: this.items,
            totalCount: this.count
        }
    }

    

    private async updateList(changes: Partial<ListState>){
        const listContainer = await this.getListContainer()
        this.changes = {}
        this.state = listContainer.State
        const lineMenuSubject = new Subject<{key: string, data?: any}>()
        lineMenuSubject.subscribe((event) => this.onClientMenuClick(event.key, event.data))
        const genericListAdapter = new GenericListAdapter(listContainer, this.clientEventsService, lineMenuSubject)
        const genericListData = genericListAdapter.adapt()
        this.notifyObservers(genericListData, listContainer)
    }

    private async getListContainer(){
        if(!this.state){
            return await this.clientEventsService.emitLoadListEvent(this.state, this.changes)
        }
        return await this.clientEventsService.emitStateChangedEvent(this.state, this.changes)
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