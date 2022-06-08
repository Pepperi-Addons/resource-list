import { AddonDataScheme } from "@pepperi-addons/papi-sdk"
import {Resource, Sorting } from '../shared/entities'


export interface ViewsScheme{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    Filter: any,
    Sorting: Sorting,
}

export const viewsTable: AddonDataScheme = {
    Name: "VIEWS_TABLE",
    Type: 'meta_data',
    Fields: {
        Name: {
            Type: "String"
        }
    }
}
