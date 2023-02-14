import { ViewBlock } from "../models/configuration/view.model"

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