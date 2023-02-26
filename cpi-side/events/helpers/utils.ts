import { ViewBlock } from "../../models/configuration/view.model"
import { DropDownElement } from "../../models/events/list-layout.model"
import { Row, GridViewInputData, RelationBlock } from "../metadata"

export function createDropDown(arr: Array<Object>, keyField: string, valueField: string): DropDownElement<string>[]{
    return arr.map(val => {
        return {
            Key: val[keyField] as string,
            Value: val[valueField] as string
        }
    })
}

export function groupRelationBlocks<T extends RelationBlock>(arr: T[]){
    const drawFunctionsArray: RelationBlock[] = []
    const visitedDrawURLs = new Set<string>()
    arr.forEach(relationBlock => {
        const key = `${relationBlock.AddonUUID}_${relationBlock.DrawURL}`
        if(!visitedDrawURLs.has(key)){
            visitedDrawURLs.add(key)
            drawFunctionsArray.push({
                AddonUUID: relationBlock.AddonUUID,
                DrawURL: relationBlock.DrawURL
            })
        }
    })
    return drawFunctionsArray
}

