import { ListContainer } from "../../models/events/list-container.mode"
import { ListState } from "../../models/events/list-state.model"
import { ListService } from "../../services/list.service"
import { EventService } from "./event.service"

export class LoadListEventService extends EventService{

    async execute(currState: ListState, prevState?: ListState): Promise<ListContainer> {
        const service = new ListService()
        const list = await service.getList(currState.ListKey)
        if(!list){
            throw new Error(`list with key ${currState.ListKey} does not exist`)
        }
        return await this.listBuilder.buildListContainer(list, currState, prevState)
    }

}