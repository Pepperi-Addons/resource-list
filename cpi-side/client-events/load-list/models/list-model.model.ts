// import { MenuDataView } from "@pepperi-addons/papi-sdk";

import {  MenuDataView, MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Button } from "../../../lists/models/menu.model";



export interface ListModel{
    Key: string,
    Title: string
    ViewsMenu: ViewsMenu,
    Menu: ListMenu,
    LineMenu: ListMenu,
    Buttons: Buttons,
    Search: boolean, 
    SelectionType: "multi" | "single" | "none", //by default none
    SmartSearch: SmartSearch, // if empty array we will hide the smart search
    Sorting: Sorting,
    SelectedView: ResourceView

}

export interface SmartSearch{
    Type: 'Menu',
    Fields: SmartSearchField[]
}

export type SmartSearchField = MenuDataViewField & { Type: SchemeFieldType}


export interface ResourceView{
    Type: "Grid" | "Cards"
    Title: string,
    ViewBlocks : ViewBlocks
    Items: ItemCell[], 
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

export interface Buttons{
    buttons: Button[]
}

 // represent one row (i.e. one item)
 // the matching between block and property is done by the "key" 
 export interface ItemCell {
     [Key: string]: any
 }

export type DropDownElement<T> =  {Key: string, Value: T}
