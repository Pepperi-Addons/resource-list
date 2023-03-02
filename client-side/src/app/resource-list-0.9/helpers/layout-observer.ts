import { Subject } from "rxjs"
import { GenericListAdapterResult, SmartSearchInput } from "../metadata"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { GVButton } from "src/app/generic-viewer/generic-viewer.model"
import { PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list"

export class LayoutObserver{
    //subjects 
    private $smartSearch: Subject<SmartSearchInput> = new Subject()
    private $menu: Subject<PepMenuItem[]> = new Subject()
    private $buttons: Subject<GVButton[]> = new Subject()
    private $lineMenu: Subject<LineMenuActionsObject> = new Subject()
    private $search: Subject<boolean> = new Subject()
    private $title: Subject<string> = new Subject()
    private $selectionType: Subject<PepListSelectionType> = new Subject()

    /**
     * 
     * @param data - the generic list data 
     * this function will update the observers of the layout if anything changed
     * for example if the menu changed, this function will emit menu changed event and invoke the onMenuChange call
     */
    notifyObservers(data: GenericListAdapterResult){
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
        if(data.search != undefined){
            this.$search.next(data.search)
        }
        if(data.title){
            this.$title.next(data.title)
        }
        if(data.selectionType){
            this.$selectionType.next(data.selectionType)
        }
    }
    // update variables

    onSmartSearchChanged(cb: (data: SmartSearchInput) => void){
        this.$smartSearch.subscribe(cb)
        return this
    }

    onSelectionTypeChanged(cb: (selectionType: PepListSelectionType) => void){
        this.$selectionType.subscribe(cb)
        return this
    }

    onSearchChanged(cb: (visible: boolean) => void){
        this.$search.subscribe(cb)
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
    
    onTitleChanged(cb: (title: string) => void){
        this.$title.subscribe(cb)
        return this
    }
}


interface LineMenuActionsObject {
    get: (data: PepSelectionData) => Promise<{title: string, handler: (selectedRows: any) => Promise<any>}[]>
}