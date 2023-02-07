import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.routes'
import { router as viewsRouter } from './routes/views.routes'
import { ListLayoutBuilder } from './client-events/load-list/helpers/list-layout-builder';
import { buildListModel } from './client-events/load-list/controllers/load-list-event';
import { LoadListEventService } from './client-events/services/load-list-event.service';
export async function load(configuration: any) {
    console.log('cpi side works!');
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
    // Put your cpi side code here
}

export const router = Router()
//routes:

//generic resources routes:
router.use('/resources', genericResourceRouter)

//views routes:
router.use('/views', viewsRouter)

//route for testing event
router.post('/OnClientLoadList', async (req, res, next) => {
    const prevState = req.body.prevState
    const currState = req.body.currState
    return res.json(await new LoadListEventService().execute(prevState, currState))
    // const result =  await buildListModel({ListKey: 'LIST1'})
    // return res.json(result)x
})