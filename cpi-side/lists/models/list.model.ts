import { JSONFilter } from "@pepperi-addons/pepperi-filters"
import { LineMenuConfiguration, MenuConfiguration } from "./menu.model"
import { SearchConfiguration, SmartSearchConfiguration } from "./search.model"

export interface List{
    Key: string,
    Name: string,
    Description?: string,
    Resource: string,
    Profile: string,
    Views: View[],
    Menu: MenuConfiguration, //TODO: listMenu ... 
    LineMenu: LineMenuConfiguration
    Search: SearchConfiguration,
    SmartSearch: SmartSearchConfiguration,
    Filter?: JSONFilter,
    Sorting: Sorting,
    SelectionType: SelectionType
}

export type SelectionType = "single" | "multi" | "none" //TODO: uppper case