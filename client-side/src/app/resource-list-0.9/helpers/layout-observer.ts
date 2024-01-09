import {  ReplaySubject } from "rxjs"
import { GenericListAdapterResult, PepSelectElement, SmartSearchInput } from "../metadata"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { GVButton } from "../metadata"
import { PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list"
import { ViewsMenu } from "shared"

export class LayoutObserver{
    //subjects 
    private $smartSearch: ReplaySubject<SmartSearchInput> = new ReplaySubject()
    private $menu: ReplaySubject<PepMenuItem[]> = new ReplaySubject()
    private $buttons: ReplaySubject<GVButton[]> = new ReplaySubject()
    private $search: ReplaySubject<boolean> = new ReplaySubject()
    private $title: ReplaySubject<string> = new ReplaySubject()
    private $selectionType: ReplaySubject<PepListSelectionType> = new ReplaySubject()
    private $viewsMenu: ReplaySubject<ViewsMenu> = new ReplaySubject()
    private $selectedView: ReplaySubject<string> = new ReplaySubject()

    /**
     * 
     * @param data - the generic list data 
     * this function will update the observers of the layout if anything changed
     * for example if the menu changed, this function will emit menu changed event and invoke the onMenuChange call
     */
    notifyObservers(data: GenericListAdapterResult){
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
        if(data.title != undefined){
            this.$title.next(data.title)
        }
        if(data.selectionType){
            this.$selectionType.next(data.selectionType)
        }
        if(data.viewsMenu){
            this.$viewsMenu.next(data.viewsMenu)
        }
        if(data.selectedViewKey){
            this.$selectedView.next(data.selectedViewKey)
        }
    }
    // update variables

    onSmartSearchChanged(cb: (data: SmartSearchInput) => void): LayoutObserver{
        this.$smartSearch.subscribe(cb)
        return this
    }

    onSelectionTypeChanged(cb: (selectionType: PepListSelectionType) => void): LayoutObserver{
        this.$selectionType.subscribe(cb)
        return this
    }

    onSearchChanged(cb: (visible: boolean) => void): LayoutObserver{
        this.$search.subscribe(cb)
        return this
    }

    onMenuChanged(cb: (data: PepMenuItem[]) => void): LayoutObserver{
        this.$menu.subscribe(cb)
        return this
    }


    onButtonsChanged(cb: (data: GVButton[]) => void): LayoutObserver{
        this.$buttons.subscribe(cb)
        return this
    }
    
    onTitleChanged(cb: (title: string) => void): LayoutObserver{
        this.$title.subscribe(cb)
        return this
    }
    onViewsMenuChanged(cb: (menu: ViewsMenu) => void): LayoutObserver{
        this.$viewsMenu.subscribe(cb)
        return this
    }
    onSelectedViewChanged(cb: (key: string) => void): LayoutObserver{
        this.$selectedView.subscribe(cb)
        return this
    }
}


interface LineMenuActionsObject {
    get: (data: PepSelectionData) => Promise<{title: string, handler: (selectedRows: any) => Promise<any>}[]>
}