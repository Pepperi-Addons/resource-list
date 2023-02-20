
export interface ListData{
    Items: Row[]
    Count?: number
}

export interface Row{
    [key: string]: string | boolean | number | Date,
}