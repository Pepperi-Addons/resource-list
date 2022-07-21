import { IPepDraggableItem } from "@pepperi-addons/ngx-lib/draggable-items"
import { BaseFormDataViewField, DataView, DataViewField, DataViewFieldType, GridDataViewField, MenuDataViewField } from "@pepperi-addons/papi-sdk"

export const CREATION_DATE_TIME_TITLE = "Creation Date Time"
export const MODIFICATION_DATE_TIME_TITLE = "Modification Date Time"
export const CREATION_DATE_TIME_ID = "CreationDateTime"
export const MODIFICATION_DATE_TIME_ID = "ModificationDateTime"

export interface IMappedField {
    id: string
    field: {
      FieldID: string
      Title: string;
      Type: DataViewFieldType;
      ReadOnly: boolean
      Mandatory: boolean
    },
    width?: number
}
export interface IViewMappedField extends IMappedField{
  width: number
}
export interface IEditorMappedField extends IMappedField{

}

export interface IDataService{
  getItems(key?: string , includeDeleted?: boolean)
  upsertItem(item: any)
}

export interface IFieldConvertor {
  fieldToMappedField(field: DataViewField):IMappedField
  mappedFieldToField(mappedField: IMappedField, index: number): IDataViewField
  draggableItemToMappedField(draggableItem: IPepDraggableItem)
}

export type IDataViewField = GridDataViewField | BaseFormDataViewField

// type WithRequiredProp<Type, Key extends keyof Type> = Omit<Type, Key> &  Required<Pick<Type, Key>>;

// export type DataViewWithContext = WithRequiredProp<DataView, 'Context'>