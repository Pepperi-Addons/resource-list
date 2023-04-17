import { IPepSmartFilterData } from "@pepperi-addons/ngx-lib/smart-filters";
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters";
import { NGXFilterOperationFactory } from "./ngx-filters";

export class JSONToNGXFilterAdapter{

    static adapt(filters: JSONRegularFilter[]): IPepSmartFilterData[]{
        return filters.map(filter => NGXFilterOperationFactory.create(filter))
    }
}