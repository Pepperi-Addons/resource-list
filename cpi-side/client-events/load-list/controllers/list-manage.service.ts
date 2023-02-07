import { getList } from "../../../lists/list-data";
import { List } from "../../../lists/models/list.model";
import { ListState } from "../../models/list-state.model";
import { ListLayoutBuilder } from "../helpers/list-layout-builder";
import { ListContainer, ListData, ListLayout } from "../models/list-model.model";
import { ListDataBuilder } from "../helpers/list-data-builder";



export class ListBuilder{
    
    constructor(){}

    buildLayout(list: List, prevState: ListState | undefined, currState: ListState): ListLayout{
        if(list.Key != currState.ListKey){
            throw new Error(`list and state does not match. key of the list: ${list.Key}, listKey in state - ${currState.ListKey}`)
        }
       return  new ListLayoutBuilder(list, prevState ,currState).build()
    }

    async buildListData(list: List, prevState: ListState | undefined, currState: ListState): Promise<ListData | undefined>{
        if(list){
            return undefined
        }
        return await new ListDataBuilder(list, prevState, currState).build()
    }

    async buildListContainer(list: List, prevState: ListState, currState: ListState): Promise<ListContainer>{
        const layout = this.buildLayout(list,prevState,  currState)
        const data = await this.buildListData(list, prevState,  currState)
        return {
            Layout: layout,
            Data: data,
            State: currState
        }
    }
}