import { IPepSmartFilterData } from "@pepperi-addons/ngx-lib/smart-filters";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { JSONRegularFilterBuilder } from "./json-regular-filter-builder";
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters";

export class NgxFiltersAdapter{

    constructor(private filters: IPepSmartFilterData[] = [], private resourceFields: AddonDataScheme['Fields']){

    }

    adapt(): JSONRegularFilter[]{
        return this.filters.map((filter, index) => {
            const type = this.resourceFields[filter.fieldId]?.Type || "String"
            return JSONRegularFilterBuilder.create(filter, type)
        })
    }
}






