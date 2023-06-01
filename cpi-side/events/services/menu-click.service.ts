import { ListState, ListContainer, List } from "shared";
import { ListService } from "../../services/list.service";
import { IContext } from "@pepperi-addons/cpi-node/build/cpi-side/events";
import { debug } from "console";

export class MenuClickService{

    async execute(state: ListState, key: string, listConfiguration?: List, context?: IContext): Promise<ListContainer> {
        const service = new ListService()
        const list = listConfiguration || await service.getList(state.ListKey)
        if(!list){
            throw Error(`on menu click event - list with key ${state.ListKey} does not exist`)
        }
        //split by the first underscore , e.g 'a_b_c_d' will be ['a', 'b_c_d', '']
        const [addonUUID, menuKey] = key.split(/_(.*)/s)

        const block = list.Menu.Blocks.find(block =>  block.AddonUUID == addonUUID && block.Key == menuKey )

        if(!block){
            throw Error(`no Block with key ${key} was found on the list ${list.Key}`)
        }
        //call the execute function 
        const result =  await pepperi.addons.api.uuid(addonUUID).post({
            url: block.ExecuteURL,
            body: { State: state , Key: menuKey, Context: context }
        }) as ListContainer

        return result
    }

}