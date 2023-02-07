// import { MenuDataView } from "@pepperi-addons/papi-sdk";

import {  MenuDataView, MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { ListState } from "../../models/list-state.model";
import { SelectionType } from "../../../lists/models/list.model";



export interface ListLayout{
    Key: string,
    Title: string
    ViewsMenu: ViewsMenu,
    Menu: Menu,
    LineMenu: Menu,
    Search: boolean, 
    SelectionType: SelectionType, //by default none
    SmartSearch: SmartSearch, // if empty array we will hide the smart search
    Sorting: Sorting,
    View: ViewLayout
}

export interface ListContainer{
    Layout?: ListLayout,
    Data?: ListData,
    State?: ListState

}

export interface SmartSearch{
    Type: 'Menu',
    Fields: SmartSearchField[]
}

export type SmartSearchField = MenuDataViewField & { Type: SchemeFieldType}


export interface ViewLayout{
    Type: "Grid" | "Cards"
    ViewBlocks : ViewBlocks

}

export interface ListData{
    Items: ItemCell[], 
}

export interface ViewBlocks{
    Fields: ViewBlock[]
}


export interface ViewsMenu{
    Visible: boolean;
    Items: {Key: string, Value: string}[]
}

export interface Menu{
    Menu: MenuDataView
}



 // represent one row (i.e. one item)
 // the matching between block and property is done by the "key" 
 export interface ItemCell {
     [Key: string]: any
 }

export type DropDownElement<T> =  {Key: string, Value: T}
