import { ViewBlock } from "../models/configuration/view.model"
import { ListState } from "../models/events/list-state.model"

export interface RelationBlock{
    AddonUUID: string,
    DrawURL: string
}

export interface GridRow{
    [key: string]: string | boolean | number | Date,
}

export interface GridViewInputData{
    Items: {[key: string]: any}[],
    ViewBlocks: ViewBlock[]
}


export interface GridViewOutputData{
   GridData: GridRow[]
}

export const defaultStateValues: Omit<ListState, "ListKey" | "ViewKey"> = {
    SearchString: "",
    SmartSearchQuery: [],
    PageSize: 100,
    PageIndex: 1,
    ItemSelection: {Items: [], SelectAll: false},
}