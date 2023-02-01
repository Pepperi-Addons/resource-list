import { JSONFilter } from "@pepperi-addons/pepperi-filters"
import { LineMenuConfiguration, MenuConfiguration } from "./menu.model"
import { SearchConfiguration, SmartSearchConfiguration } from "./search.model"

export interface List{
    Key: string,
    Title: string,
    Description?: string,
    Resource: string,
    Editor?: string,
    Profile: string,
    Views: View[]
    Menu: MenuConfiguration,
    LineMenu: LineMenuConfiguration
    Search: SearchConfiguration,
    SmartSearch: SmartSearchConfiguration,
    Filter?: JSONFilter,
    Sorting: Sorting
    SelectionType: SelectionType
}

export type SelectionType = "single" | "multi" | "none"