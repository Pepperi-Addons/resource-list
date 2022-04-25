import { TranslateService } from '@ngx-translate/core';
import { DataViewFieldType } from '@pepperi-addons/papi-sdk';
import { HashMap, TypeMap } from './type-map'
export class ResourceMap{
    typeMap: TypeMap;
    resourceFieldsMap: HashMap<any> = {}
    constructor(){
        this.typeMap = new TypeMap()
        this.typeMap.init();
    }
    add(fieldID: string, type: DataViewFieldType, title: string, mandatory: boolean, optionalValues?){
        this.resourceFieldsMap[fieldID] = {
            'FieldID': fieldID,
            'Type': this.typeMap.get(type, optionalValues) || type,
            'Title': title,
            'Mandatory': mandatory,
            'ReadOnly': true
        }
    }
    get(key: string){
        return this.resourceFieldsMap[key];
    }
    getKeys(){
        return Object.keys(this.resourceFieldsMap)
    }
    initMapFromResource(resource, translate: TranslateService){
        this.add('CreationDateTime', 'DateAndTime', translate.instant('CreationDateTime'), false)
        this.add('ModificationDateTime', 'DateAndTime', translate.instant('ModificationDateTime'), false)
        for(let fieldKey of Object.keys(resource.Fields)){
            const mandatory = resource.Fields[fieldKey]?.Mandatory
            const optionalValues =resource.Fields[fieldKey]?.OptionalValues
            const type = this.typeMap.get(resource.Fields[fieldKey]?.Type, optionalValues)
            this.add(fieldKey, type, fieldKey, mandatory, optionalValues)
        }
    }
}