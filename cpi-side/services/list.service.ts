import { LIST1 } from "../dummy-list";

export class ListService{
    async getList(key: string){
        return LIST1
    }
}