import { IPepDraggableItem } from "@pepperi-addons/ngx-lib/draggable-items"
import { BaseFormDataViewField, DataViewField, DataViewFieldType, GridDataViewField, MenuDataViewField } from "@pepperi-addons/papi-sdk"
import { SelectOption } from "../../../shared/entities"
import { AddFormComponent } from "./add-form/add-form.component"
import { ViewsCard } from "./draggable-card-fields/cards.model"

export const CREATION_DATE_TIME_TITLE = "Creation Date Time"
export const MODIFICATION_DATE_TIME_TITLE = "Modification Date Time"
export const CREATION_DATE_TIME_ID = "CreationDateTime"
export const MODIFICATION_DATE_TIME_ID = "ModificationDateTime"


export interface IMappedField {
    field: {
      FieldID: string
      Title: string;
      Type?: DataViewFieldType;
      ReadOnly?: boolean
      Mandatory?: boolean,
      OriginalName?: string
    },
    width?: number
}
export interface IViewMappedField extends IMappedField{
  width: number
}
export interface IEditorMappedField extends IMappedField{
  
}
export type MenuField = MenuDataViewField & {OriginalName: string}


export interface IDataService{
  getItems(key?: string , includeDeleted?: boolean)
  upsertItem(item: any),
}

export interface IFieldConvertor {
  fieldToMappedField(field: DataViewField):IMappedField
  mappedFieldToField(mappedField: IMappedField, index: number): IDataViewField
  draggableItemToMappedField(draggableItem: IPepDraggableItem)
}

export type IDataViewField = GridDataViewField | BaseFormDataViewField | MenuDataViewField
export const defaultCollectionFields = [
  {
    FieldID: CREATION_DATE_TIME_ID,
    Title: CREATION_DATE_TIME_TITLE,
    Type: 'DateAndTime',
    Mandatory: true,
    ReadOnly: true
  },
  {
    FieldID: MODIFICATION_DATE_TIME_ID,
    Title: MODIFICATION_DATE_TIME_TITLE,
    Type: 'DateAndTime',
    Mandatory: true,
    ReadOnly: true
  },
  {
    FieldID: "Key",
    Type: "TextBox",
    Title: "Key",
    Mandatory: true,
    ReadOnly: true,
  }
]
export interface IGenericViewerConfigurationObject{
  resource: string,
  viewsList: SelectOption[],
  selectionList?: {
    none: boolean,
    selection: 'single' | 'multi'
  }
}

export const SELECTION_TYPE = "SelectionType"
export const EXPORT = "Export"
export const IMPORT = "Import"

type SussesObject<T> = {
  data: T
  error?: undefined
}
type ErrorObject = {
  data?: undefined
  error: string
}
export type ResultObject<T> = SussesObject<T> | ErrorObject
export const SELECTION_LIST = "SelectionList"
export const DROP_DOWN = "DropDown"