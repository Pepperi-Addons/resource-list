import { List, ListState } from "shared";
import { LoadListEventService } from "../services/load-list-event.service";

export class LoadListController{
    static async loadList(state: Partial<ListState>, changes: ListState, list?: List){
        try{
            //if we don't get a key from the list and not from the changes, there could not be any load list
            if(!list && !changes?.ListKey){
                throw Error(`load list controller - list or list key in the changes object must be exist`)
            }
            return await new LoadListEventService().execute(state, changes, list)
        }catch(err){
            throw Error(`error inside OnClientLoadList event: ${err}`)
        }
    }
}