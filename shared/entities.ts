export interface SelectOption{
    key: string,
    value: string
}
export interface Field{
    FieldID: string
    Mandatory: boolean
    ReadOnly: boolean
    Title: string
    Type: string
}

export interface View{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    Filter?: any,
    Sorting?: Sorting,
    Editor?: string,
    CreationDateTime: string,
    ModificationDateTime: string
}

export interface Editor{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    OpenMode: OpenMode,
    ReferenceFields?: IReferenceField[]
}

export type OpenMode = "popup" | "same-page"

export interface Resource{
    AddonUUID: string,
    Name: string
}

export interface Sorting{
    FieldKey: string,
    Ascending: boolean
}

export interface IReferenceField {
    FieldID: string,
    DisplayField: string,
    Resource: string,
    SelectionType: "SelectionList" | "DropDown"
    SelectionList?: string,
    SelectionListKey: string
  }
  
  export const  REFERENCE_TYPE = "Resource"
  export const SELECTION_LIST = "SelectionList"
  export const DROP_DOWN = "DropDown"