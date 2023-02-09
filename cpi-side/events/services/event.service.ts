import { ListContainer } from "../../models/events/list-container.mode"
import { ListState } from "../../models/events/list-state.model"
import { ListBuilder } from "../helpers/list-builder"

export abstract class EventService{
    listBuilder!: ListBuilder
    constructor(){
        this.listBuilder = new ListBuilder()
    }
    abstract execute(currState: ListState, prevState?: ListState): Promise<Partial<ListContainer>>
}