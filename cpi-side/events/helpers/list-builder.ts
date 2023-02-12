import { List } from "../../models/configuration/list.model"
import { ListContainer } from "../../models/events/list-container.mode"
import { ListLayout } from "../../models/events/list-layout.model"
import { ListState } from "../../models/events/list-state.model"
import { ListLayoutBuilder } from "./layout-builder"

export class ListBuilder{
    
    constructor(){}

    async buildLayout(list: List, state: ListState | undefined , changes: Partial<ListState>): Promise<Partial<ListLayout>>{
        if(list.Key != changes.ListKey){
            throw new Error(`list and state does not match. key of the list: ${list.Key}, listKey in state - ${changes.ListKey}`)
        }
       return  await new ListLayoutBuilder(list, state ,changes).build()
    }

    // async buildListData(list: List, prevState: ListState | undefined, currState: ListState): Promise<ListData | undefined>{
    //     if(list){
    //         return undefined
    //     }
    //     return await new ListDataBuilder(list, prevState, currState).build()
    // }

    async buildListContainer(list: List, state: ListState | undefined, changes: Partial<ListState>): Promise<Partial<ListContainer>>{
        const layout = await this.buildLayout(list ,state,  changes)
        return {
            Layout: layout,
            Data: undefined,
            State: state
        }
    }
}