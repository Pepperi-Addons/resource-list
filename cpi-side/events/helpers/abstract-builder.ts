import { List, ListState } from "shared";

export abstract class Builder<T>{

    constructor(){}
    /**
     * 
     * @param list - the current list configuration
     * @param state - the current state of the list
     * @param changes - the current changes of the list
     * @returns T if needs to be rendered otherwise returns null
     */
    abstract build(list: List, state: Partial<ListState> | undefined, changes: Partial<ListState>): T | null    

}