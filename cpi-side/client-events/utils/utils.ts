import { DropDownElement } from "../load-list/models/list-model.model"

export function createDropDown(arr: Array<Object>, keyField: string, valueField: string): DropDownElement<string>[]{
    return arr.map(val => {
        return {
            Key: val[keyField] as string,
            Value: val[valueField] as string
        }
    })
}

//hardcoded for now, suppose to be on relation
//the draw function
export function getCellBlock(gridViewInputData: GridViewInputData){
    const grid: GridCell[][] = []
    const data = gridViewInputData.Items
    const viewBlocks = gridViewInputData.ViewBlocks
    data.forEach(item => {
        const row: GridCell[] = []
        viewBlocks.forEach(block => {
               let value = item[block.Configuration.FieldID]
               if(block.Configuration.FieldID == "friends"){
                   value = value.join(" , ")
               }
               row.push({[block.Configuration.FieldID]: value})     
       })
       grid.push(row)
    })      
    return { GridData: grid }
}

export interface GridCell{
    [key: string]: string | boolean | number | Date,
}

interface GridViewInputData{
    Items: {[key: string]: any}[],
    ViewBlocks: ViewBlock[]
}

interface GridViewOutputData{
   GridData: GridCell[][]
}