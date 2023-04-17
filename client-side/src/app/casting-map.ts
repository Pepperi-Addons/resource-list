import { HashMap } from "shared"

export class CastingMap{
    private map: HashMap<(val: any) => any> = {};
    constructor(){
        this.init()
    }
    init(){
        this.map['Integer'] = (val) => Number(val)
        this.map['Double'] = (val) => Number(val)
        this.map['Bool'] = (val) => !(val == 'false' || !val)
    }
    cast(type:string, val: any): any{
        const castFunction = this.map[type]
        if(castFunction){
            return castFunction(val)
        }
        return val
    }
}