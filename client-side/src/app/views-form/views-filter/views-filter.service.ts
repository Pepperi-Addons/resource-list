import { Injectable } from "@angular/core";
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
            if(resourceField.Indexed){
                result.push({
                    FieldID: fieldID, 
                    Title: fieldID,
                    FieldType: resourceField.Type
                })

            }
        })
        return result
    }
}