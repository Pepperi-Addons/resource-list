export interface ListData{
    Items: ItemCell[]
}

 // represent one row (i.e. one item)
 // the matching between block and property is done by the "key" 
 export interface ItemCell {
    [Key: string]: any
}