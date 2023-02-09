import { List } from "../../models/configuration/list.model"
import { ListContainer } from "../../models/events/list-container.mode"
import { ListLayout } from "../../models/events/list-layout.model"
import { ListState } from "../../models/events/list-state.model"
import { ListLayoutBuilder } from "./layout-builder"

export class ListBuilder{
    
    constructor(){}

    async buildLayout(list: List, prevState: ListState | undefined, currState: ListState): Promise<Partial<ListLayout>>{
        if(list.Key != currState.ListKey){
            throw new Error(`list and state does not match. key of the list: ${list.Key}, listKey in state - ${currState.ListKey}`)
        }
       return  await new ListLayoutBuilder(list, prevState ,currState).build()
    }

    // async buildListData(list: List, prevState: ListState | undefined, currState: ListState): Promise<ListData | undefined>{
    //     if(list){
    //         return undefined
    //     }
    //     return await new ListDataBuilder(list, prevState, currState).build()
    // }

    async buildListContainer(list: List, currState: ListState, prevState?: ListState): Promise<Partial<ListContainer>>{
        const layout = await this.buildLayout(list,prevState,  currState)
        return {
            Layout: layout,
            Data: undefined,
            State: currState
        }
    }
}