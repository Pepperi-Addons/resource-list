import { PepStyleType } from "@pepperi-addons/ngx-lib"
import { PepButton } from "@pepperi-addons/ngx-lib/button"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { SelectOption } from "shared"

export interface ListOptions {
    actions: any
    selectionType: "multi" | "single"
    menuItems: PepMenuItem[]
    dropDownOfViews: SelectOption[]
    buttons: GVButton[]
}

export interface GVButton extends PepButton {
    styleType: PepStyleType

}
