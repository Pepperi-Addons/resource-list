import { HashMap } from "./type-map";

export class CastingMap{
    private map: HashMap<(val: any) => any> = {};
    constructor(){
        this.init()
    }
    init(){
        this.map['Integer'] = (val) => Number(val)
        this.map['Double'] = (val) => Number(val)
        this.map['Bool'] = (val) => Boolean(val)
    }
    cast(type:string, val: any): any{
        const castFunction = this.map[type]
        if(castFunction){
            return castFunction(val)
        }
        return val
    }
}