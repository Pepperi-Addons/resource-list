import { IPepSmartFilterData, IPepSmartFilterDataValue, IPepSmartFilterOperator, IPepSmartFilterOperatorUnit } from "@pepperi-addons/ngx-lib/smart-filters";

export class NGXNumberFilter implements IPepSmartFilterData{
    fieldId: string;
    operator: IPepSmartFilterOperator;
    operatorUnit?: IPepSmartFilterOperatorUnit;
    value: IPepSmartFilterDataValue;

}
