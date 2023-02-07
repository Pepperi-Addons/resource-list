import { ListBuilder } from "../load-list/controllers/list-manage.service";
import { ListContainer } from "../load-list/models/list-model.model";
import { ListState } from "../models/list-state.model";

export abstract class EventService{
    listBuilder!: ListBuilder
    constructor(){
        this.listBuilder = new ListBuilder()
    }
    abstract execute(prevState: ListState, currState: ListState): Promise<ListContainer>
}