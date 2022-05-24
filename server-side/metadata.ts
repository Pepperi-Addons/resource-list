import { AddonDataScheme } from "@pepperi-addons/papi-sdk"


export interface ViewsScheme{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    Filter: any,
    Sorting: Sorting,
}

export interface Resource{
    AddonUUID: string,
    Name: string
}

export interface Sorting{
    FieldKey: string,
    Ascending: boolean
}

export interface View{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    Filter?: any,
    Sorting?: Sorting,
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