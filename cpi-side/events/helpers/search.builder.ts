import { ListSearch } from "shared"
import { Search } from "shared"
import { ListState } from "shared"

export class SearchBuilder{
    /**
     * this function will return Search element
     * the search will be visible only if some fields are configured to be search on
     * and function will return undefined if no change on search state is required
     * @param search - the search configuration 
     * @param state - the current state
     * @param changes - the changes on the state that emit this event
     */
    build(search: ListSearch, state: ListState, changes: Partial<ListState>): Search | undefined{
        //the only case when we return a search is on the load of the list, thats happen only if current state is undefined
        if(!state){
            return { Visible: search.Fields.length > 0 }
        }
        return undefined
    }
}