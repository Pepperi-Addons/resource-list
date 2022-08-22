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
        return this
    }
    get(key:string, optionalValues = []): DataViewFieldType{
        if(key == 'Array'){
            return optionalValues?.length > 0? "MultiTickBox" : "TextArea"
        }
        else if(optionalValues.length > 0){
            return "ComboBox"
        }
        const result = this.map[key]
        return result; 
    }
}