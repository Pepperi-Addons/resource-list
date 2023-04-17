import { PepStyleType } from "@pepperi-addons/ngx-lib"
import { PepButton } from "@pepperi-addons/ngx-lib/button"
import { PepListSelectionType } from "@pepperi-addons/ngx-lib/list"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { MenuDataView } from "@pepperi-addons/papi-sdk"
import { SelectOption } from "shared"

export interface ListOptions {
    actions: any
    selectionType: PepListSelectionType
    menuItems: PepMenuItem[]
    dropDownOfViews: SelectOption[]
    buttons: GVButton[]
    smartSearchDataView: {dataView: MenuDataView},
    searchDataView: MenuDataView,
    inlineList: boolean,
    showSearch: boolean
}

export interface GVButton extends PepButton {
    styleType: PepStyleType
}
