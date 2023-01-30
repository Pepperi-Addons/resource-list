// import { MenuDataView } from "@pepperi-addons/papi-sdk";

import { MenuDataView } from "@pepperi-addons/papi-sdk";
import { Button } from "../../lists/model/menu.model";

export interface ListModel{
    Key: string,
    ViewsMenu: ViewsMenu,
    Menu: ListMenu,
    LineMenu: ListMenu,
    Buttons: Buttons,
    Search: boolean, 
    SelectionType: "multi" | "single" | "none",
    SmartSearchConfig: SmartSearchField[], // if empty array we will hide the smart search
    Sorting: Sorting,
    ViewBlock : ViewBlock[]
    Items: ItemCell [], 
}

interface ViewsMenu{
    Visible: boolean,
    Items: {Key: string, Value: string}[]
}

interface ListMenu{
    Menu: MenuDataView
}

interface Buttons{
    buttons: Button[]
}

interface  SmartSearchField { 
     FieldID: string
     Type: string  //SchemeFieldType
     Title: string 
 }

 // represent one row (i.e. one item)
 // the matching between block and property is done by the "key" 
 interface ItemCell {
     [key: string]: any
 }
