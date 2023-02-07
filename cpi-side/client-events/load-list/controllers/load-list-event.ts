import { getList } from "../../../lists/list-data";
import {  ListLayout } from "../models/list-model.model";
import { ListState } from "../../models/list-state.model";
import { ListLayoutBuilder } from "../helpers/list-layout-builder";



export async function buildListModel(prevState: ListState, currState: ListState): Promise<ListLayout>{
    const list = getList(currState.ListKey)

    if(!list){
        console.error(`list with key ${currState.ListKey} does not exist`)
        throw new Error(`list with key ${currState.ListKey} does not exist`)
    }
    return await new ListLayoutBuilder(list, currState).build()

}


/**
 * 
 * ListContainerBuilder - state
 * build - build layout , build data, return {data, layout, state} 
 * onClientEdit
 * ListDataBuilder
 * ListLayoutBuilder
 * ListStateBuilder
 * 
 * ListLayoutBuilder - state, configuration
 * */