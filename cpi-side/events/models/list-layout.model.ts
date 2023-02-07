import { SelectionType } from "../../configuration/models/list.model"
import { ListMenu, ListMenuBlock } from "../../configuration/models/menu.model"
import { ListSmartSearch } from "../../configuration/models/search.model"

export interface ListLayout{
    Key: string,
    Title: string
    ViewsMenu: ViewsMenu,
    Menu: ListMenu,
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

