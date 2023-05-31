import { List, ListSmartSearch, ListState } from "shared";

export class SmartSearchBuilder{

    constructor(){}
        /**
     * 
     * @param list - the current list configuration
     * @param state - the current state of the list
     * @param changes - the current changes of the list
     * @returns the smart search if and only if the smart search needs to be re rendered, otherwise returns null.
     * in case of smart search is not configured the function will return the default value of the smart search.
     */
    build(list: List, state: Partial<ListState> | undefined, changes: Partial<ListState>): ListSmartSearch | null{
        return changes.ListKey != undefined ? list.SmartSearch || { Fields: [] } : null
    }
5

    
}