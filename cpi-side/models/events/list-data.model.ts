export interface ListData{
    Items: RowData[]
}

 // represent one row (i.e. one item)
 // the matching between block and property is done by the "key" 
 export interface RowData {
    [Key: string]: any
}