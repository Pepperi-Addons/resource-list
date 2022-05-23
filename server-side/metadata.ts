import { AddonDataScheme } from "@pepperi-addons/papi-sdk"
import { View, Sorting, Resource } from "../shared/entities"



export const viewsTable: AddonDataScheme = {
    Name: "VIEWS_TABLE",
    Type: 'meta_data',
    Fields: {
        Name: {
            Type: "String"
        }
    }
}

// export function isView(arg: any): arg is View {
//     return arg && arg.Key && typeof(arg.Key) === 'string' && arg.Name && typeof(arg.Name) === 'string' && arg.Resource && isResource(arg.Resource) &&
//      (!arg.Sorting || isSorting(arg.Sorting)) && arg.Description && typeof(arg.Description) === 'string'
// }
// function isResource(arg: any): arg is Resource{
//     return arg.AddonUUID && arg.Name && typeof(arg.AddonUUID) === 'string' && typeof(arg.Name) === 'string'
// }
// function isSorting(arg: any): arg is Sorting{
//     return arg.FieldKey && arg.Ascending && typeof(arg.FieldKey) === 'string' && typeof(arg.Ascending) === 'boolean'
// }