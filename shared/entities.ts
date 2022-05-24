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
