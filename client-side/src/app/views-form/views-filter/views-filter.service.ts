import { Injectable, Optional } from "@angular/core";
import { IPepQueryBuilderField } from "@pepperi-addons/ngx-lib/query-builder";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";

@Injectable({ providedIn: 'root' })
export class ViewsFilterService{
    constructor(){}
    
    getIndexedFields(resourceFields: AddonDataScheme['Fields']){

    }
    resourceFieldsToQueryBuilderFields(resourceFields: AddonDataScheme['Fields'] = {}):IPepQueryBuilderField[]{
        const result: IPepQueryBuilderField[] = []
        Object.keys(resourceFields).forEach(fieldID => {
            const resourceField = resourceFields[fieldID]
            const optionalValuesLength = resourceField['OptionalValues']?.length || 0 
            const optionalValues = resourceField['OptionalValues']?.map(val => {return {Key: val, Value: val} }) || []
            if(resourceField.Indexed){
                const item = {
                    FieldID: fieldID, 
                    Title: fieldID,
                    FieldType: optionalValuesLength > 0 ? 'ComboBox' : resourceField.Type === 'Resource' ? 'String': resourceField.Type,
                }
                if(optionalValuesLength > 0) {
                    item['OptionalValues'] = optionalValues;
                }
                result.push(item);
            }
        })
        return result
    }
}