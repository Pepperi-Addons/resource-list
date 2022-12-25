import { AddonDataScheme, BaseFormDataView, GridDataView, MenuDataView } from "@pepperi-addons/papi-sdk"
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
    ModificationDateTime: string,
    isFirstFieldDrillDown: boolean,
    availableFields: AvailableField[]
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
  export interface IGenericViewer{
    view: View,
    viewDataview: GridDataView
    editor?: Editor
    editorDataView?: BaseFormDataView,
    menuItems?: MenuDataView,
    lineMenuItems?: MenuDataView,
    filter: string,
    smartSearchDataView?: MenuDataView
  }
  
  export const  REFERENCE_TYPE = "Resource"
  export const SELECTION_LIST = "SelectionList"
  export const DROP_DOWN = "DropDown"
  export const ARRAY_TYPE = "Array"
  export const CONTAINED_RESOURCE_TYPE = "ContainedResource"

  export interface AvailableField{
    Name: string,
    Type: string
}