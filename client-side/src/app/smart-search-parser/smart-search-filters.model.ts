import { AnyOperation, FieldType, JSONBaseFilter, JSONRegularFilter, NumberOperation } from "@pepperi-addons/pepperi-filters";

export interface SmartFilter{
    fieldId: string;
    operator: SmartFilterOperator;
    operatorUnit: SmartFilterOperatorUnit;
    value: any
}

export interface SmartFilterOperator{
    componentType: string[]
    id: string
    short: string
    name: string
}

export abstract class RegularFilter implements JSONBaseFilter{
    FieldType: FieldType;
    ApiName: string;
    Operation: AnyOperation;
    Values: string[];

    constructor(filter: SmartFilter){
        this.ApiName = filter.fieldId
        this.setOperationAndValues(filter)
    }
    abstract setOperationAndValues(filter: SmartFilter): void
}

export abstract class NumberFilter extends RegularFilter{
    FieldType: "Integer" | "Double"
    Operation: NumberOperation

    setOperationAndValues(filter: SmartFilter){
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

type SmartFilterOperatorUnit = Omit<SmartFilterOperator, "short">