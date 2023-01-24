import { AddonDataScheme, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { DateOperation, JSONComplexFilter, JSONDateTimeFilter, JSONDoubleFilter, JSONIntegerFilter, JSONRegularFilter, JSONStringFilter, StringOperation, concat, toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { NumberFilter, RegularFilter, SmartFilter } from "./smart-search-filters.model";

export class SmartSearchParser{
    private jsonFilters: (JSONRegularFilter | JSONComplexFilter)[]
    constructor(filters: SmartFilter[], resourceFields: AddonDataScheme['Fields']){
        this.jsonFilters = this.convertSmartSearchFilterToJsonFilterArray(filters, resourceFields)
        return this
    }
    toString(){
        if(!this.jsonFilters || this.jsonFilters.length == 0){
            return ''
        }
        const firstFilter = this.jsonFilters.pop()
        return toApiQueryString(concat(true, firstFilter, ...this.jsonFilters))
    }
    private convertSmartSearchFilterToJsonFilterArray(filters: SmartFilter[], resourceFields: AddonDataScheme['Fields']): (JSONRegularFilter | JSONComplexFilter)[]{
        return filters.map((filter, index) => {
            const type = resourceFields[filter.fieldId]?.Type || "String"
            return JSONRegularFilterBuilder.create(filter, type)
        })
    }
}
class JSONRegularFilterBuilder{
    static create(filter: SmartFilter, type: SchemeFieldType): JSONRegularFilter | JSONComplexFilter{

        switch (type){
            case "Integer":
                return new IntegerFilter(filter)
            case 'ContainedResource':
            case 'Resource':
            case "String":
                return  new StringFilter(filter)
            //will be in the future
            // case "Boolean":
            //     return "Bool"

            case "Double":
                return new DoubleFilter(filter)
            case "DateTime":
                return new DateFilter(filter)

            //maybe will be in the future:
            // case "DateAndTime":
            //     return new ComplexFilter(filter)
        }
    }
}
// class ComplexFilter implements JSONComplexFilter{
//     RightNode: JSONFilter;
//     LeftNode: JSONFilter;
//     Operation: "AND" | "OR";
//     constructor(filter: SmartFilter){
//         this.createComplextFilter(filter)
//     }
    
//     createComplextFilter(filter: SmartFilter){
//         debugger
//         switch(filter.operator.id){
//             case "dateRange":
//                 this.createBetweenDatesFilter(filter)
//                 break;
//         }
//     }
//     createBetweenDatesFilter(filter: SmartFilter){
//         const startDateFilter: JSONDateFilter = {
//             FieldType: "Date",
//             Operation: ">",
//             ApiName: filter.fieldId,
//             Values: [filter.value['first']]
//         }
//         const endDateFilter: JSONDateFilter = {
//             FieldType: "Date",
//             Operation: "<",
//             ApiName: filter.fieldId,
//             Values: [filter.value['second']]
//         }
//         const betweenFilter = concat(true, startDateFilter, endDateFilter) as JSONComplexFilter
//         this.Operation = betweenFilter.Operation
//         this.LeftNode = betweenFilter.LeftNode;
//         this.RightNode = betweenFilter.RightNode
//     }   
// }

class IntegerFilter extends NumberFilter implements JSONIntegerFilter{
    FieldType: "Integer" = "Integer"
}
class DoubleFilter extends NumberFilter implements JSONDoubleFilter{
    FieldType: "Double" = "Double"
}

class DateFilter extends RegularFilter implements JSONDateTimeFilter{
    FieldType: "DateTime" = "DateTime"
    Operation: DateOperation

    setOperationAndValues(filter: SmartFilter): void {
        this.Values = Object.values(filter.value)
        switch(filter.operator.id){
            case "dateRange":
                this.Operation = "Between"
                break;
            case "inTheLast":
                this.Values.push("Months")
                this.Operation = "InTheLast"
                break;
            case "today":
                this.Operation = "Today"
                this.Values = []
                break;
            case "thisWeek":
                this.Operation = "ThisWeek"
                this.Values = []
                break;
            case "thisMonth":
                this.Operation = "ThisMonth"
                this.Values = []
                break;
            case "dueIn":
                this.Operation = "DueIn"
                this.Values.push(capitalizeFirstLetter(filter.operatorUnit.id))
                break;
            case "on":
                this.Operation = "On"
            case "notInTheLast":
                this.Operation = "NotInTheLast"
                this.Values.push(capitalizeFirstLetter(filter.operatorUnit.id))
                break;
            case "notDueIn":
                this.Operation = "NotDueIn"
                this.Values.push(capitalizeFirstLetter(filter.operatorUnit.id))
                break;
            case "isEmpty":
                this.Operation = "IsEmpty"
                this.Values = []
                break;
            case "isNotEmpty":
                this.Operation = "IsNotEmpty"
                this.Values = []
                break;
        }
    }

}

function capitalizeFirstLetter(s: string){
   return s.charAt(0).toUpperCase() + s.slice(1)
}
class StringFilter extends RegularFilter implements JSONStringFilter{
    FieldType: "String" = "String"
    Operation: StringOperation

    setOperationAndValues(filter: SmartFilter): void {
        this.Values = Object.values(filter.value)
        switch(filter.operator.id){
            case "contains":
                this.Operation = "Contains"
                break;
            case "beginsWith":
                this.Operation = "StartWith"
                break;
            case "endsWith":
                this.Operation = "EndWith"
                break;
            case 'eq':
                this.Operation = "IsEqual"
                break;
            case 'neq':
                this.Operation = "IsNotEqual"
                break;
        }
    }

}




