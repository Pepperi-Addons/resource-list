export interface ListState {
    ListKey: string,
    ViewKey?: string, // default use the first
    SearchString?: string, // default no search 
    SmartSearchQuery?: SmartSearchQuery[], //default no search
    Sorting?: Sorting, // default CreationDateTime, Ascending=false
    FromIndex?: number, // default 0
    ToIndex?: number, //default 49
    PageIndex?: number // default = 1 (first page) - does not make sense to have from to index with page index
    ItemSelection?: ItemSelection // default empty 
}

interface SmartSearchQuery{
    FieldId: string;
    Operator: SmartFilterOperator;
    OperatorUnit: SmartFilterOperatorUnit;
    Value: any
}

interface SmartFilterOperator{
    componentType: string[]
    id: string
    short: string
    name: string
}

type SmartFilterOperatorUnit = Omit<SmartFilterOperator, "short">

interface ItemSelection{
    SelectAll: Boolean // default false 
    Items: string[] // key list - limit to 500 keys
  }