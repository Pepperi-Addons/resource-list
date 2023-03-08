import { ListContainer } from "shared"
import { ListState } from "shared"
import { ListBuilder } from "../helpers/list-builder"

export abstract class EventService{
    listBuilder!: ListBuilder
    constructor(){
        this.listBuilder = new ListBuilder()
    }
    abstract execute(state: ListState, changes: Partial<ListState>): Promise<Partial<ListContainer>>
}