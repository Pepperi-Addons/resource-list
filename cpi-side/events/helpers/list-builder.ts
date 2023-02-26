import { List } from "../../models/configuration/list.model"
import { ListContainer } from "../../models/events/list-container.mode"
import { ListData } from "../../models/events/list-data.model"
import { ListLayout } from "../../models/events/list-layout.model"
import { ListState } from "../../models/events/list-state.model"
import { ListDataBuilder } from "./data-builder"
import { ListLayoutBuilder } from "./layout-builder"

export class ListBuilder{
    
    constructor(){}

    async buildLayout(list: List, state: ListState | undefined , changes: Partial<ListState>): Promise<Partial<ListLayout> | undefined>{
        if(!changes.ListKey){
            return undefined
        }
       return  await new ListLayoutBuilder(list, state ,changes).build()
    }

    async buildData(list: List, state: Partial<ListState>, changes: Partial<ListState>): Promise<ListData | undefined>{
        return await new ListDataBuilder(list,state,changes).build()
    }   
}