import { JSONFilter } from "@pepperi-addons/pepperi-filters"
import {  ListMenu } from "./menu.model"
import { ListSearch, ListSmartSearch  } from "./search.model"
import { ListView as View } from "./view.model"
import { Sorting } from "./sorting.model"



export interface List{
    Key: string,
    Name: string,
    Description?: string,
    Resource: string,
    Views: View[]
    Menu: ListMenu,
    LineMenu: ListMenu,
    Search: ListSearch,
    SmartSearch: ListSmartSearch,
    Filter?: JSONFilter,
    Sorting: Sorting
    SelectionType: SelectionType
}

export type SelectionType = "Single" | "Multi" | "None"