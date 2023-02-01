import { getList } from "../../../lists/list-data";
import {  ListModel } from "../models/list-model.model";
import { ListState } from "../../models/list-state.model";
import { ListModelBuilder } from "../helpers/list-builder";



export async function buildListModel(state: ListState): Promise<ListModel>{
    const list = getList(state.ListKey)

    if(!list){
        console.error(`list with key ${state.ListKey} does not exist`)
        throw new Error(`list with key ${state.ListKey} does not exist`)
    }
    return await new ListModelBuilder(list, state).build()

}