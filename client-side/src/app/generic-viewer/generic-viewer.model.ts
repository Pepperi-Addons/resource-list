import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { SelectOption } from "../../../../shared/entities"

export interface ListOptions {
    actions: any
    selectionType: "multi" | "single"
    menuItems: PepMenuItem[]
    dropDownOfViews: SelectOption[]
    button: GVButton
    hasCancelButton: Boolean
}

type GVButton = { title: string }