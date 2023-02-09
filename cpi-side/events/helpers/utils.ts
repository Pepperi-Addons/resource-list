import { DropDownElement } from "../../models/events/list-layout.model"

export function createDropDown(arr: Array<Object>, keyField: string, valueField: string): DropDownElement<string>[]{
    return arr.map(val => {
        return {
            Key: val[keyField] as string,
            Value: val[valueField] as string
        }
    })
}