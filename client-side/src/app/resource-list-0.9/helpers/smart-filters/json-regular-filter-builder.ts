import { IPepSmartFilterData } from "@pepperi-addons/ngx-lib/smart-filters"
import { SchemeFieldType } from "@pepperi-addons/papi-sdk"
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters"
import { DateFilter, DoubleFilter, IntegerFilter, StringFilter } from "./json-regular-filters"

export class JSONRegularFilterBuilder{
    static create(filter: IPepSmartFilterData, type: SchemeFieldType): JSONRegularFilter{

        switch (type){
            case "Integer":
                return new IntegerFilter(filter)
            case 'ContainedResource':
            case 'Resource':
            case "String":
                return  new StringFilter(filter)
            case "Double":
                return new DoubleFilter(filter)
            case "DateTime":
                return new DateFilter(filter)
            default:
                throw Error('not supported yet')
        }
    }
}