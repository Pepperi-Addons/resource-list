import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { ListState } from "shared";

export class GLParamsAdapter{

    constructor(private params: IPepGenericListParams){
    
    }

    //convert params to state
    adapt(): Partial<ListState>{

        const changes: Partial<ListState> = {}
        changes.SearchString = this.params.searchString || ''
        changes.SmartSearchQuery = this.params.filters || []
        changes.PageIndex = this.params.pageIndex || 1
        
        if(this.params.sorting){
            changes.Sorting = {
                FieldID: this.params.sorting.sortBy,
                Ascending: this.params.sorting.isAsc
            }
        }
        return changes
    }
}