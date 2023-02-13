import { List } from "../../models/configuration/list.model";
import { ListState } from "../../models/events/list-state.model";

export class ListDataBuilder{

    constructor(private list: List, private state: ListState | undefined, private changes: Partial<ListState>){}

    async build(){
        
    }

}