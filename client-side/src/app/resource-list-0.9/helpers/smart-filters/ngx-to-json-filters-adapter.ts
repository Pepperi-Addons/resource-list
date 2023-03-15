import { IPepSmartFilterData } from "@pepperi-addons/ngx-lib/smart-filters";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { JSONRegularFilterFactory } from "./json-regular-filter-factory";
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters";

export class NgXToJSONFilterAdapter{

    static adapt(filters: IPepSmartFilterData[] = [], resourceFields: AddonDataScheme['Fields'] ): JSONRegularFilter[]{
        return filters.map((filter, index) => {
            const type = resourceFields[filter.fieldId]?.Type || "String"
            return JSONRegularFilterFactory.create(filter, type)
        })
    }
}






