import { IPepSmartFilterData } from "@pepperi-addons/ngx-lib/smart-filters";
import { AnyOperation, DateOperation, FieldType, JSONBaseFilter, JSONDateTimeFilter, JSONDoubleFilter, JSONIntegerFilter, JSONStringFilter, NumberOperation, StringOperation } from "@pepperi-addons/pepperi-filters";
import { capitalizeFirstLetter } from "../../metadata";

export abstract class RegularFilter implements JSONBaseFilter{
    FieldType: FieldType;
    ApiName: string;
    Operation: AnyOperation;
    Values: string[];

    constructor(filter: IPepSmartFilterData){
        this.ApiName = filter.fieldId
        this.setOperationAndValues(filter)
    }
    abstract setOperationAndValues(filter: IPepSmartFilterData): void
}

export abstract class NumberFilter extends RegularFilter{
    FieldType: "Integer" | "Double"
    Operation: NumberOperation

    setOperationAndValues(filter: IPepSmartFilterData){
        this.Values = Object.values(filter.value)
        switch (filter.operator.id){
            case "eq":
                this.Operation = "="
                break
            case "neq":
                this.Operation = "!="
                break
            case 'lt':
                this.Operation = "<"
                break
            case "gt":
                this.Operation =  ">"
                break
            case "numberRange":
                this.Operation = "Between"
                break
        }
    }
}


export class IntegerFilter extends NumberFilter implements JSONIntegerFilter{
    FieldType: "Integer" = "Integer"
}

export class DoubleFilter extends NumberFilter implements JSONDoubleFilter{
    FieldType: "Double" = "Double"
}

export class DateFilter extends RegularFilter implements JSONDateTimeFilter{
    FieldType: "DateTime" = "DateTime"
    Operation: DateOperation

    setOperationAndValues(filter: IPepSmartFilterData): void {
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



export class StringFilter extends RegularFilter implements JSONStringFilter{
    FieldType: "String" = "String"
    Operation: StringOperation

    setOperationAndValues(filter: IPepSmartFilterData): void {
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