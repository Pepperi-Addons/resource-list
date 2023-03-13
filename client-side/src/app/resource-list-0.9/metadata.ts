
import { MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { DataSource } from "./helpers/data-source"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { PepButton } from "@pepperi-addons/ngx-lib/button"
import { PepStyleType } from "@pepperi-addons/ngx-lib"

export const loadListEventKey = "OnClientLoadList"

export type SmartSearchField = MenuDataViewField & {Type: SchemeFieldType}

export type GenericListAdapterResult = {
    dataSource?: DataSource,
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