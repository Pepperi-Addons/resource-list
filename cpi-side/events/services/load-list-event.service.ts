import { ListContainer } from "../../models/events/list-container.mode"
import { ListState } from "../../models/events/list-state.model"
import { ListService } from "../../services/list.service"
import { EventService } from "./event.service"

export class LoadListEventService extends EventService{

    async execute(state: ListState | undefined, changes: Partial<ListState>): Promise<ListContainer> {
        if(!changes?.ListKey){
            throw new Error(`list key must be supplied on load list event`)
        }
        const service = new ListService()
        const list = await service.getList(changes.ListKey)
        if(!list){
            throw new Error(`list with key ${changes.ListKey} does not exist`)
        }
        const layout = await this.listBuilder.buildLayout(list, state, changes)
        const viewsMenu = layout.ViewsMenu?.Items
        let viewKey: string | undefined = undefined 
        if(viewsMenu && viewsMenu.length > 0){
            viewKey = viewsMenu[0].Key
        }
        const newState: ListState = {...changes, ViewKey: viewKey, ListKey: list.Key}
        return await this.listBuilder.buildListContainer(list, state, changes)
    }

}