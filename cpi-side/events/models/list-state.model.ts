import { JSONFilter } from "@pepperi-addons/pepperi-filters";

export interface ListState {
    ListKey: string,
    ViewKey?: string, // default use the first
    SearchString?: string, // default no search 
    SmartSearchQuery?: JSONFilter
    Sorting?: Sorting, // default CreationDateTime, Ascending=false
    PageSize?: number //default is 50!
    PageIndex?: number // default = 1 (first page) - does not make sense to have from to index with page index
    ItemSelection?: ItemSelection // default empty 
}

interface ItemSelection{
    SelectAll: Boolean // default false 
    Items: string[] // key list - limit to 500 keys
  }