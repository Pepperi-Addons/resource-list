import { IPepSmartFilterData } from "@pepperi-addons/ngx-lib/smart-filters";
import { JSONRegularFilter } from "@pepperi-addons/pepperi-filters";

export class JSONRegularFiltersAdapter{

    constructor(private filters: JSONRegularFilter[]){

    }

    adapt(): IPepSmartFilterData[]{
        return []
    }
}