
export interface ListData{
    Items: GridRow[]
    Count?: number
}

export interface GridRow{
    [key: string]: string | boolean | number | Date,
}