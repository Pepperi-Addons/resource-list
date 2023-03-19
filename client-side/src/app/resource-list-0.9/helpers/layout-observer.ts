import { BehaviorSubject, ReplaySubject, Subject } from "rxjs"
import { GenericListAdapterResult, SmartSearchInput } from "../metadata"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { GVButton } from "../metadata"
import { PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list"

export class LayoutObserver{
    //subjects 
    private $smartSearch: BehaviorSubject<SmartSearchInput> = new BehaviorSubject({dataView: {Fields: [], Type: 'Menu'}})
    private $menu: BehaviorSubject<PepMenuItem[]> = new BehaviorSubject([])
    private $buttons: BehaviorSubject<GVButton[]> = new BehaviorSubject([])
    private $lineMenu: BehaviorSubject<LineMenuActionsObject> = new BehaviorSubject({get: async () => []})
    private $search: BehaviorSubject<boolean> = new BehaviorSubject(false)
    private $title: BehaviorSubject<string> = new BehaviorSubject('')
    private $selectionType: BehaviorSubject<PepListSelectionType> = new BehaviorSubject('none')

    /**
     * 
     * @param data - the generic list data 
     * this function will update the observers of the layout if anything changed
     * for example if the menu changed, this function will emit menu changed event and invoke the onMenuChange call
     */
    notifyObservers(data: GenericListAdapterResult){
        if(data.lineMenu != undefined){
            this.$lineMenu.next(data.lineMenu)
        }
        if(data.buttons != undefined){
            this.$buttons.next(data.buttons)
        }
        if(data.menu != undefined){
            this.$menu.next(data.menu)
        }
        if(data.smartSearch){
            this.$smartSearch.next(data.smartSearch)
        }
        if(data.search != undefined){
            this.$search.next(data.search)
        }
        if(data.title != undefined){
            this.$title.next(data.title)
        }
        if(data.selectionType != undefined){
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