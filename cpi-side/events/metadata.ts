import { DataRow, ViewBlock } from "shared"
import { ListState } from "shared"

export interface RelationBlock{
    AddonUUID: string,
    DrawURL: string
}



export interface DrawViewInputData{
    Items: {[key: string]: any}[],
    ViewBlocks: ViewBlock[]
}


export interface DrawViewOutputData{
   Data: DataRow[]
}

export const defaultStateValues: Omit<ListState, "ListKey" | "ViewKey"> = {
    SearchString: "",
    SmartSearchQuery: [],
    PageSize: 100,
    PageIndex: 1,
    ItemSelection: {Items: [], SelectAll: false},
}
