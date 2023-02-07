import { getList } from "../../lists/list-data";
import { ListContainer } from "../load-list/models/list-model.model";
import { ListState } from "../models/list-state.model";
import { EventService } from "./events.model";

export class LoadListEventService extends EventService{

    async execute(prevState: ListState, currState: ListState): Promise<ListContainer> {
        const list = getList(currState.ListKey)
        if(!list){
            throw new Error(`list with key ${currState.ListKey} does not exist`)
        }
        return await this.listBuilder.buildListContainer(list, prevState, currState)
    }

}