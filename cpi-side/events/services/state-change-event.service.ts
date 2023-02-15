import { ListContainer } from "../../models/events/list-container.mode"
import { ListState } from "../../models/events/list-state.model"
import { ListService } from "../../services/list.service"
import { RequireField, defaultStateValues } from "../metadata"
import { EventService } from "./event.service"

export class ChangeStateEvent extends EventService{
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
        const viewsMenu = layout?.ViewsMenu?.Items
        let viewKey: string | undefined = undefined 
        if(viewsMenu && viewsMenu.length > 0){
            viewKey = viewsMenu[0].Key
        }

        const newState: ListState = {...defaultStateValues, ...changes,  ViewKey: viewKey, ListKey: list.Key}
        const data = await this.listBuilder.buildData(list, newState, changes)
        return {
            Layout: layout,
            Data: data,
            State: newState
        }
    }

}