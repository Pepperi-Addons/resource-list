import { DrawnMenuBlock, ListMenu, ListMenuBlock } from "../../../configuration/models/menu.model";
import { ListSmartSearch, ListSmartSearchField } from "../../../configuration/models/search.model";
import { ListState } from "../list-state.model";

export class SmartSearchBuilder{

    constructor(){}

    build(smartSearch: ListSmartSearch, currState: ListState, prevState?: ListState): ListSmartSearch | undefined{
        /** if there is a smart search and the we are on load list event (thats mean that prev state is undefined) we returning the smart search
         * in all other cases there is no need to re render the smart search
         */
        if(!prevState && smartSearch.Fields.length > 0){
            return smartSearch
        }
        return undefined
    }


    
}