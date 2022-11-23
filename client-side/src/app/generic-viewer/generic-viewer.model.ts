import { PepButton } from "@pepperi-addons/ngx-lib/button"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { SelectOption } from "../../../../shared/entities"

export interface ListOptions {
    actions: any
    selectionType: "multi" | "single"
    menuItems: PepMenuItem[]
    dropDownOfViews: SelectOption[]
    // button: GVButton
    buttons: GVButton[]
}

// type GVButton = { title: string }
export interface GVButton extends PepButton {
    styleType: "strong" | "weak"

}
