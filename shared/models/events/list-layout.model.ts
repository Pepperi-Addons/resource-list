import { SelectionType } from "../configuration/list.model"
import { ListMenuBlock } from "../configuration/menu.model"
import { ListSmartSearch } from "../configuration/search.model"
import { Sorting } from "../configuration/sorting.model"
import {  ViewType } from "../configuration/view.model"
import { ViewBlock } from "../view.model"
export interface ListLayout{
    Title: string
    ViewsMenu: ViewsMenu,
    Menu: Menu,
    LineMenu: Menu,
    Search: Search, 
    SelectionType: SelectionType, //by default none
    SmartSearch: ListSmartSearch, // if empty array we will hide the smart search
    Sorting: Sorting,
    View: ViewLayout
}
export interface Search{
    Visible: boolean
}
export type MenuBlock = ListMenuBlock & {Hidden: boolean}
export interface Menu{
    Blocks: MenuBlock[]
}

export interface ViewBlocks{
    Blocks: ViewBlock[]
}

export interface ViewLayout{
    Type: ViewType
    ViewBlocks : ViewBlocks
    Key: string

}

export interface ViewsMenu{
    Visible: boolean;
    Items: DropDownElement<string>[]
}

export type DropDownElement<T> =  {Key: string, Value: T}

