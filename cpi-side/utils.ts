export function buildHiddenAndKeyQuery(hidden: boolean = false, key: string | undefined){
    let query =  `Hidden=${hidden}`
    if(key){
        query += ` AND Key=${key}`
    }
    return query
}