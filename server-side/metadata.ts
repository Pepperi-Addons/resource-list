import { AddonDataScheme } from "@pepperi-addons/papi-sdk"
import {OpenMode, Resource, Sorting } from '../shared/entities'


export interface ViewsScheme{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    Filter: any,
    Sorting: Sorting,
}


export interface EditorScheme{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    OpenMode: OpenMode
}

export const viewsTable: AddonDataScheme = {
    Name: "VIEWS_TABLE",
    Type: 'meta_data',
}
export const editorsTable: AddonDataScheme = {
    Name: "EDITORS_TABLE",
    Type: 'meta_data',
}
