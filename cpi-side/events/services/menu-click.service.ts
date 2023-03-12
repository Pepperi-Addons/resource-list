import { ListState, ListContainer } from "shared";
import { EventService } from "./event.service";

export class MenuClickService{

    async execute(state: ListState, key: string): Promise<Partial<ListContainer>> {
        return {State:{...state,  SearchString: "aaaa"}}
    }

}