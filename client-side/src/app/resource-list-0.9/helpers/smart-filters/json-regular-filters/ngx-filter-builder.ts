import { IPepSmartFilterData } from "@pepperi-addons/ngx-lib/smart-filters"
import { SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters"

export class NGXFilterBuilder{
    static create(filter: JSONRegularFilter, type: SchemeFieldType): IPepSmartFilterData{
        switch (type){
            case "Integer":
                // return new IntegerFilter(filter)
            case 'ContainedResource':
            case 'Resource':
            case "String":
                // return  new StringFilter(filter)
            case "Double":
                // return new DoubleFilter(filter)
            case "DateTime":
                // return new DateFilter(filter)
            default:
                throw Error('not supported yet')
        }
        return {
            fieldId: 'sadfsaf',
            operator: {id: 'after', componentType: [], short: 'a', name: 'a'},
            value: {first: 'a'}
        }
    }
}