import { IPepSmartFilterData, IPepSmartFilterDataValue, IPepSmartFilterOperator, IPepSmartFilterOperatorUnit, PepSmartFilterOperatorUnitType } from "@pepperi-addons/ngx-lib/smart-filters";
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters";

//TODO Decorator pattern to reuse code
export class NGXFilterOperationFactory{

    static create(filter: JSONRegularFilter): NGXFilterOperation{
        if(filter.FieldType == "JsonBool" || filter.FieldType == "Guid"){
            throw Error(`error in ngx filter operation factory, cannot convert filter with type ${filter.FieldType} to ngx lib smart filter`)
        }
        switch(filter.Operation){
            case "IsEqual":
            case "=": 
                return new NGXFilterEqualOperation(filter)

            case "!=":
            case "IsNotEqual":
                return new NGXFilterNotEqualOperation(filter)

            case ">":
                return new NGXFilterGreaterThanOperation(filter)

            case "<":
                return new NGXFilterLessThanOperation(filter)

            case "Between":
                return NGXFilterBetweenOperationFactory.create(filter)

            case "Contains":
                return new NGXFilterContainsOperation(filter)

            case "StartWith":
                return new NGXFilterBeginsWithOperation(filter)

            case "EndWith":
                return new NGXFilterEndsWithOperation(filter)

            //dates:
            case "InTheLast":
                return new NGXFilterInTheLastOperation(filter)

            case "DueIn":
                return new NGXFilterDueInOperation(filter)
            
            case "NotDueIn":
                return new NGXFilterNotDueInOperation(filter)

            case "Today":
                return new NGXFilterTodayOperation(filter)

            case "ThisWeek":
                return new NGXFilterThisWeekOperation(filter)

            case "ThisMonth":
                return new NGXFilterThisMonthOperation(filter)
            
            case "IsEmpty":
                return new NGXFilterIsEmptyOperation(filter)

            case "IsNotEmpty":
                return new NGXFilterIsNotEmptyOperation(filter)

            case "On":
                return new NGXFilterOnOperation(filter)

            default:
                throw Error(`error: ${filter.Operation} is not supported!!`)
        }
    }
}

class NGXFilterBetweenOperationFactory{

    static create(filter: JSONRegularFilter){
        if(filter.Operation != "Between"){
            throw Error(`error in NGXFilterBetweenOperationFactory, operation of type ${filter.Operation} is not supported`)
        }
        switch(filter.FieldType){
            case "Integer":
            case "Double":
                return new NGXFilterNumberRangeOperation(filter)
            case "Date":
                return new NGXFilterDateRangeOperation(filter)
        }
    }
}

export abstract class NGXFilterOperation implements IPepSmartFilterData{
    fieldId: string;
    operator: IPepSmartFilterOperator;
    operatorUnit?: IPepSmartFilterOperatorUnit;
    value: IPepSmartFilterDataValue;

    constructor(filter: JSONRegularFilter){
        this.fieldId = filter.ApiName
        this.value = {first: null}
    }
}

class NGXFilterEqualOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number', 'boolean', 'text'],
            id: 'eq',
            name: "EQUAL",
            short: "="
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterNotEqualOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number', 'text'],
            id: 'neq',
            name: "NOT_EQUAL",
            short: "<>"
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterLessThanOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number'],
            id: 'lt',
            name: "LESS_THEN",
            short: "<"
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterGreaterThanOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number'],
            id: 'gt',
            name: "GREATER_THEN",
            short: ">"
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterNumberRangeOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number'],
            id: 'numberRange',
            name: "NUMBER_RANGE",
            short: "Range"
        }
        this.value = {first: filter.Values[0], second: filter.Values[1]}
    }
}

class NGXFilterContainsOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['text'],
            id: 'contains',
            name: "CONTAINS",
            short: "Contains"
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterBeginsWithOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['text'],
            id: 'beginsWith',
            name: "BEGINS_WITH",
            short: "Begins With"
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterEndsWithOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['text'],
            id: 'endsWith',
            name: "ENDS_WITH",
            short: "Ends With"
        }
        this.value = {first: filter.Values[0]}
    }
}

class  NGXFilterInTheLastOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        
        this.operator = {
            componentType: ['date'],
            id: 'inTheLast',
            name: "IN_THE_LAST",
            short: "In the last"
        }
        this.operatorUnit = {
            componentType: ['date'],
            id: filter.Values[1].toLowerCase() as PepSmartFilterOperatorUnitType,
            name: filter.Values[1].toUpperCase()
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterDateRangeOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "dateRange",
            name: "DATE_RANGE",
            short: "Range"
        }
        this.value = {first: filter.Values[0], second: filter.Values[1]}
    }
}

class NGXFilterTodayOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "today",
            name: "TODAY",
            short: "Today"
        }
    }
}

class NGXFilterThisWeekOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "thisWeek",
            name: "THIS_WEEK",
            short: "This week"
        }
    }
}

class NGXFilterThisMonthOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "thisMonth",
            name: "THIS_MONTH",
            short: "This month"
        }
    }
}

class NGXFilterIsEmptyOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "isEmpty",
            name: "IS_EMPTY",
            short: "Is empty"
        }
    }
}

class NGXFilterIsNotEmptyOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "isNotEmpty",
            name: "IS_NOT_EMPTY",
            short: "Is not empty"
        }
    }
}

class NGXFilterOnOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "on",
            name: "ON",
            short: "On"
        }
        this.value = {first: filter.Values[0]}
    }
}


class NGXFilterDueInOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "dueIn",
            name: "DUE_IN",
            short: "Due In"
        }
        this.operatorUnit = {
            componentType: ['date'],
            id: filter.Values[1].toLowerCase() as PepSmartFilterOperatorUnitType,
            name: filter.Values[1].toUpperCase()
        }
        this.value = {first: filter.Values[0]}
    }
}

class NGXFilterNotDueInOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "notDueIn",
            name: "NOT_DUE_IN",
            short: "Not due In"
        }
        this.operatorUnit = {
            componentType: ['date'],
            id: filter.Values[1].toLowerCase() as PepSmartFilterOperatorUnitType,
            name: filter.Values[1].toUpperCase()
        }
        this.value = {first: filter.Values[0]}
    }
}

