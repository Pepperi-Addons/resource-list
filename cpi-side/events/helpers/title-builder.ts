import { List, ListSearch, ListState } from "shared";

export class TitleBuilder{

    constructor(){}
    /**
     * 
     * @param list - the current list configuration
     * @param state - the current state of the list
     * @param changes - the current changes of the list
     * @returns the title if and only if the title needs to be re rendered, otherwise returns null
     */
    build(list: List, state: Partial<ListState> | undefined, changes: Partial<ListState>): string | null{
        return changes.ListKey != undefined ? list.Name: null
    }


    
}