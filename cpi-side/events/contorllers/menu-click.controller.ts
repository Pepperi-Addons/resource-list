import { List, ListState } from "shared"
import { MenuClickService } from "../services/menu-click.service"
import { IContext } from "@pepperi-addons/cpi-node/build/cpi-side/events"

export class MenuClickController{
    static async onMenuClicked(state: ListState, key: string, list?: List, context?: IContext){
        try{
            if(!state?.ListKey){
                throw Error(`in menu click event - state must includes list key`)
            }
            if(!key){
                throw Error(`in menu click event - no key found for the menu item`)
            }
            
            return await new MenuClickService().execute(state, key, list, context)        
        }catch(err){
            throw Error(`error inside onClientMenuClick event: ${JSON.stringify(err)}`)
        }
    }
}