
import { GridDataView, MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { PepButton } from "@pepperi-addons/ngx-lib/button"
import { PepStyleType } from "@pepperi-addons/ngx-lib"
import { PepListSelectionType } from "@pepperi-addons/ngx-lib/list"

export const loadListEventKey = "OnClientLoadList"
export const stateChangeEventKey = "OnClientStateChange"
export type SmartSearchField = MenuDataViewField & {Type: SchemeFieldType}

export type GenericListAdapterResult = {
    dataView?: GridDataView,
    smartSearch?: SmartSearchInput,
    menu?: PepMenuItem[]
    buttons?: GVButton[],
    lineMenu?: any,
    search?: boolean, 
    title?: string,
    selectionType?: PepListSelectionType
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

export function capitalizeFirstLetter(s: string){
    return s.charAt(0).toUpperCase() + s.slice(1)
 }