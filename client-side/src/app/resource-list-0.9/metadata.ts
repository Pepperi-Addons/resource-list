
import { MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { DataSource } from "./helpers/data-source"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"

export const loadListEventKey = "OnClientLoadList"

export type SmartSearchField = MenuDataViewField & {Type: SchemeFieldType}

export type GenericListAdapterResult = {
    dataSource?: DataSource,
    smartSearch?: SmartSearchInput,
    menu?: PepMenuItem[]
}

export type SmartSearchInput = {
    dataView: {
        Type: "Menu",
        Fields: SmartSearchField[]
    }
}