import { DropDownElement } from "shared"
import { RelationBlock } from "../metadata"

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

export function isArrayEquals<T>(arr: T[] | undefined, arr2: T[] | undefined): boolean{
    //if both undefined then they are equals, if just one of them is undefined then they are not equals
    if(!arr && !arr2){
        return true
    }
    if(!arr || !arr2){
        return false
    }
    return arr?.length != arr2?.length && arr.every((val, index) => arr2[index] == val)
}

