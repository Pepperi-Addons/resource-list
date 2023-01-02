import { DataViewFieldType, GridDataViewField } from "@pepperi-addons/papi-sdk";
import { DateOperation, JSONComplexFilter, JSONDateTimeFilter, JSONDoubleFilter, JSONIntegerFilter, JSONRegularFilter, JSONStringFilter, StringOperation, concat, toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { NumberFilter, RegularFilter, SmartFilter } from "./smart-search-filters.model";

export class SmartSearchParser{
    private jsonFilters: (JSONRegularFilter | JSONComplexFilter)[]
    constructor(filters: SmartFilter[], dataViewFields: GridDataViewField[]){
        this.jsonFilters = this.convertSmartSearchFilterToJsonFilterArray(filters, dataViewFields)
        return this
    }
    toString(){
        if(!this.jsonFilters || this.jsonFilters.length == 0){
            return ''
        }
        const firstFilter = this.jsonFilters.pop()
        return toApiQueryString(concat(true, firstFilter, ...this.jsonFilters))
    }
    private convertSmartSearchFilterToJsonFilterArray(filters: SmartFilter[], dataViewFields: GridDataViewField[]): (JSONRegularFilter | JSONComplexFilter)[]{
        return filters.map((filter, index) => {
            const type = dataViewFields.find((dataViewField => dataViewField.FieldID == filter.fieldId))?.Type || "TextBox"
            return JSONRegularFilterBuilder.create(filter, type)
        })
    }
}
class JSONRegularFilterBuilder{
    static create(filter: SmartFilter, type: DataViewFieldType): JSONRegularFilter | JSONComplexFilter{

        switch (type){
            case "NumberInteger":
                return new IntegerFilter(filter)
            case "TextBox":
                return  new StringFilter(filter)
            //will be in the future
            // case "Boolean":
            //     return "Bool"

            case "NumberReal":
                return new DoubleFilter(filter)
            case "DateAndTime":
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




