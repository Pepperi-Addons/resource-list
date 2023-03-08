
export interface ListData{
    Items: DataRow[]
    Count?: number
}

export interface DataRow{
    [key: string]: string | boolean | number | Date,
}