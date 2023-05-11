
import { GridDataView, MenuDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { PepButton } from "@pepperi-addons/ngx-lib/button"
import { PepStyleType } from "@pepperi-addons/ngx-lib"
import { PepListSelectionType } from "@pepperi-addons/ngx-lib/list"
import { IPepGenericListInitData } from "@pepperi-addons/ngx-composite-lib/generic-list"
import { ViewsMenu } from "shared"

export const loadListEventKey = "OnClientLoadList"
export const stateChangeEventKey = "OnClientStateChange"
export type SmartSearchField = MenuDataViewField & {Type: SchemeFieldType}

export type GenericListAdapterResult = {
    dataView?: IPepGenericListInitData['dataView'],
    smartSearch?: SmartSearchInput,
    menu?: PepMenuItem[]
    buttons?: GVButton[],
    search?: boolean, 
    title?: string,
    selectionType?: PepListSelectionType
    viewsMenu?: ViewsMenu
    selectedViewKey?: string
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

 export type PepSelectElement = {key: string, value: string}


 export type ViewsMenuUI = {Visible: boolean, Items: {key: string, value: string}[] }

 export interface ListEventResult extends IPepGenericListInitData {
    listData?: GenericListAdapterResult
 }