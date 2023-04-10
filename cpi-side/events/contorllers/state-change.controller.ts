import { List, ListState } from "shared"
import { ChangeStateEventService } from "../services/state-change-event.service"

export class StateChangeController{
    static async onStateChanged(state: ListState, changes: Partial<ListState>, list?: List){
        try{
            //we must have list  order to change state
            if(!state?.ListKey){
                throw Error(`in client state change event - state must contains list key`)
            }
            return await new ChangeStateEventService().execute(state , changes, list)
        }catch(err){
            throw Error(`error inside onClientStateChanged event: ${err}`)
        }
    }
}