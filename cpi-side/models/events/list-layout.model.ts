import { SelectionType } from "../configuration/list.model"
import { ListMenu } from "../configuration/menu.model"
import { ListSmartSearch } from "../configuration/search.model"
import { Sorting } from "../configuration/sorting.model"
import { ViewBlock } from "../configuration/view.model"

export interface ListLayout{
    Key: string,
    Title: string
    ViewsMenu: ViewsMenu,
    Menu: ListMenu,
    LineMenu: ListMenu,
    Search: boolean, 
    SelectionType: SelectionType, //by default none
    SmartSearch: ListSmartSearch, // if empty array we will hide the smart search
    Sorting: Sorting,
    View: ViewLayout
}

export interface ViewBlocks{
    Fields: ViewBlock[]
}

export interface ViewLayout{
    Type: "Grid" | "Cards"
    ViewBlocks : ViewBlocks

}


export interface ViewsMenu{
    Visible: boolean;
    Items: DropDownElement<string>[]
}

export type DropDownElement<T> =  {Key: string, Value: T}

