import { DataViewFieldType } from "@pepperi-addons/papi-sdk";

export interface HashMap<T>{
    [key:string]:T;
} 
export class TypeMap{
    private map: HashMap<DataViewFieldType> = {};
    constructor(){
        this.init()
    }
    init(){
        this.map['String'] = "TextBox"
        this.map['Integer'] = 'NumberInteger'
        this.map['Double'] = "NumberReal"
        this.map['Bool'] = "Boolean"
        this.map['DateTime'] = "DateAndTime"
        this.map["Resource"] = "Button"
        this.map["Array"] = "TextBox"
    }
    get(key:string): DataViewFieldType{
       return this.map[key]
    }
}