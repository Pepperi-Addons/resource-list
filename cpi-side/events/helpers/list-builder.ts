import { List, ListData, ListLayout, ListState} from "shared"
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