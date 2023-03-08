import { ListContainer } from "shared"
import { ListState } from "shared"
import { ListService } from "../../services/list.service"
import { RequireField, defaultStateValues } from "../metadata"
import { EventService } from "./event.service"

export class ChangeStateEventService extends EventService{
    /**
     * 
     * @param state must contains at least list key and view key
     * @param changes 
     * @returns 
     */
    async execute(state: RequireField<ListState, "ViewKey"> , changes: Partial<ListState>): Promise<ListContainer> {        
        const service = new ListService()
        const list = await service.getList(state.ListKey)

        if(!list){
            throw new Error(`list with key ${state.ListKey} does not exist`)
        }

        const layout = await this.listBuilder.buildLayout(list, state, changes)

        const newState: ListState = {...defaultStateValues, ...state, ...changes,}
        const data = await this.listBuilder.buildData(list, newState, changes)
        return {
            Layout: layout,
            Data: data,
            State: newState
        }
    }

}