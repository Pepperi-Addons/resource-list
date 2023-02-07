import { IContextWithData } from "@pepperi-addons/cpi-node/build/cpi-side/events"
import { buildListModel } from "./load-list/controllers/load-list-event"
import { MainFunction } from "@pepperi-addons/cpi-node"
import { LoadListEventService } from "./services/load-list-event.service"

pepperi.events.intercept('OnClientLoadList' as any, {}, async (data, next, main) => {
    try{
        const currState = data.currState
        const prevState = data.prevState
        if(!currState){
            throw Error(`current state is required`)
        }
        return await new LoadListEventService().execute(prevState, currState)
    }catch(err){
        throw Error(`error inside OnClientLoadList event: ${err}`)
    }
})
/**
 * this function getting a state and returns partial of ListContainer {data, layout, state}
 * the function will return the whole layout, the relevant data according to the state, and the state that was changed 
 * @param data 
 * @param next 
 * @param main 
 * @returns 
 */
