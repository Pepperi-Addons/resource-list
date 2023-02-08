import { List } from "../../../configuration/models/list.model";
import { defaultList } from "../../../metadata";

export function getDefaultListCopy(): List{
    return JSON.parse(JSON.stringify(defaultList))
}

export function copyObject<T extends Object>(obj: T): T{
    return JSON.parse(JSON.stringify(obj))
}