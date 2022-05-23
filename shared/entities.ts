export interface SelectOption{
    key: string,
    value: string
}
export interface Field{
    FieldID: string
    Mandatory: boolean
    ReadOnly: boolean
    Title: string
    Type: string
}

export interface View{
    Key: string,
    Name: string,
    Description: string,
    Resource: Resource,
    Filter?: any,
    Sorting?: Sorting,
}

export interface Resource{
    AddonUUID: string,
    Name: string
}

export interface Sorting{
    FieldKey: string,
    Ascending: boolean
}

export function isView(arg: any): arg is View {
    return arg && arg.Key && typeof(arg.Key) === 'string' && arg.Name && typeof(arg.Name) === 'string' && arg.Resource && isResource(arg.Resource) &&
     (!arg.Sorting || isSorting(arg.Sorting)) && arg.Description && typeof(arg.Description) === 'string'
}

function isResource(arg: any): arg is Resource{
    return arg.AddonUUID && arg.Name && typeof(arg.AddonUUID) === 'string' && typeof(arg.Name) === 'string'
}

function isSorting(arg: any): arg is Sorting{
    return arg.FieldKey && arg.Ascending && typeof(arg.FieldKey) === 'string' && typeof(arg.Ascending) === 'boolean'
}