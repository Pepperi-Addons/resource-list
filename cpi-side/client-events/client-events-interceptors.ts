import { buildListModel } from "./load-list/controllers/load-list-event"

pepperi.events.intercept('OnClientLoadList' as any, {}, async (data, next, main) => {
    try{
        const state = data.state
        if(!state){
            throw Error(`state is required`)
        }
        return await buildListModel(state)
    }catch(err){
        throw Error(`error inside OnClientLoadList event: ${err}`)
    }
})