
import { GridDataView, MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { GVButton } from "../generic-viewer/generic-viewer.model"

export const loadListEventKey = "OnClientLoadList"
export const stateChangeEventKey = "OnClientStateChange"
export type SmartSearchField = MenuDataViewField & {Type: SchemeFieldType}

export type GenericListAdapterResult = {
    dataView?: GridDataView,
    smartSearch?: SmartSearchInput,
    menu?: PepMenuItem[]
    buttons?: GVButton[],
    lineMenu?: any,
    search: boolean
}

export type SmartSearchInput = {
    dataView: {
        Type: "Menu",
        Fields: SmartSearchField[]
    }
}