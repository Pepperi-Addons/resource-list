
import { GridDataView, MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { PepButton } from "@pepperi-addons/ngx-lib/button"
import { PepStyleType } from "@pepperi-addons/ngx-lib"

export const loadListEventKey = "OnClientLoadList"
export const stateChangeEventKey = "OnClientStateChange"
export type SmartSearchField = MenuDataViewField & {Type: SchemeFieldType}

export type GenericListAdapterResult = {
    dataView?: GridDataView,
    smartSearch?: SmartSearchInput,
    menu?: PepMenuItem[]
    buttons?: GVButton[],
    lineMenu?: any
}

export interface GVButton extends PepButton {
    styleType: PepStyleType
}

export type SmartSearchInput = {
    dataView: {
        Type: "Menu",
        Fields: SmartSearchField[]
    }
}