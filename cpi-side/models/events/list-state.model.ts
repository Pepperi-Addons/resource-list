import { JSONFilter } from "@pepperi-addons/pepperi-filters";
import { Sorting } from '../configuration/sorting.model'
export interface ListState {
    ListKey: string,
    ViewKey?: string, // default use the first
    SearchString?: string, // default no search 
    SmartSearchQuery?: JSONFilter
    Sorting?: Sorting, // default CreationDateTime, Ascending=false
    PageSize?: number //default is 100!
    PageIndex?: number // default = 1 (first page)
    ItemSelection?: ItemSelection // default empty 
}

/*
    Items is limited to 500 elements
    when select all is true the items will be the non selected items, when selectAll false the items will be the selected items 
*/
interface ItemSelection{
    SelectAll: Boolean // default false 
    Items: string[] 
  }