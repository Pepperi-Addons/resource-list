import { DataViewFieldType } from "@pepperi-addons/papi-sdk"

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
    width: number
  }

  export interface IDataService{
    getItems(key?: string , includeDeleted?: boolean)
    upsertItem(item: any)
  }