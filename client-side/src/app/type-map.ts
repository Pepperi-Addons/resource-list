export interface HashMap<T>{
    [key:string]:string;
} 

export class TypeMap{
    private map: HashMap<string> = {};
    init(){
        this.map['String'] = "TextBox"
        this.map['Integer'] = 'NumberInteger'
        this.map['Double'] = "NumberReal"
        this.map['Bool'] = "Boolean"
        this.map['DateTime'] = "DateAndTime"
        return this
    }
    get(key:string, optionalValues = []){
        if(key == 'Array'){
            return optionalValues.length > 0? "MultiTickBox" : "TextArea"
        }
        if(optionalValues.length > 0){
            return "ComboBox"
        }
        const result = this.map[key]
        return result? result: "DateViewFieldType"  
    }
}