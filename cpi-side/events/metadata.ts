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
    PageSize: 25,
    PageIndex: 1,
    PageType: "Pages",
    ItemSelection: {Items: [], SelectAll: false},
}

export const DrawGridDefaultURL = "addon-cpi/drawGrid"