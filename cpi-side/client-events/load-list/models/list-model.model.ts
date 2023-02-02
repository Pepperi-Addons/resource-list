// import { MenuDataView } from "@pepperi-addons/papi-sdk";

import {  MenuDataView, MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { ListState } from "../../models/list-state.model";



export interface ListLayout{
    Title: string
    ViewsMenu: ViewsMenu,
    Menu: ListMenu,
    LineMenu: ListMenu,
    Search: boolean, 
    SelectionType: "multi" | "single" | "none", //by default none
    SmartSearch: SmartSearch, // if empty array we will hide the smart search
    Sorting: Sorting,
    SelectedView: ResourceView
    
}

export interface ListResponse{
    Key: string,
    State?: ListState,
    Layout?: ListLayout,
    Data?: ListData
}

export interface ListData{
    Items: ListItem[]
    Count?: number
}
export interface SmartSearch{
    Type: 'Menu',
    Fields: SmartSearchField[]
}

export type SmartSearchField = MenuDataViewField & { Type: SchemeFieldType}


export interface ResourceView{
    Type: "Grid" | "Cards" //dv
    Title: string,
    ViewBlocks : ViewBlocks
    Items: ListItem[], 
}

export interface ViewBlocks{
    Fields: ViewBlock[]
}


export interface ViewsMenu{
    Visible: boolean,
    Items: {Key: string, Value: string}[]
}

export interface ListMenu{
    Menu: MenuDataView
}


 // represent one row (i.e. one item)
 // the matching between block and property is done by the "key" 
 export interface ListItem {
     [Key: string]: any
 }

export type DropDownElement<T> =  {Key: string, Value: T}
