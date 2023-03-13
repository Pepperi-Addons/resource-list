
import { MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { DataSource } from "./helpers/data-source"

export const loadListEventKey = "OnClientLoadList"

export type SmartSearchField = MenuDataViewField & {Type: SchemeFieldType}

export type GenericListAdapterResult = {
    dataSource?: DataSource,
    smartSearch?: SmartSearchInput
}

export type SmartSearchInput = {
    dataView: {
        Type: "Menu",
        Fields: SmartSearchField[]
    }
}