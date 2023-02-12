import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.routes'
import { router as viewsRouter } from './routes/views.routes'
import { MenuBuilder } from './events/helpers/menu-builder';
import { ListService } from './services/list.service';
import { LoadListEventService } from './events/services/load-list-event.service';
import { ListMenuBlock } from './models/configuration/menu.model';
export async function load(configuration: any) {
    console.log('cpi side works!');
    // Put your cpi side code here
}


export const router = Router()
//routes:

//generic resources routes:
router.use('/resources', genericResourceRouter)

//views routes:
router.use('/views', viewsRouter)

router.post('/menu', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes || {}
    const listKey = state?.ListKey || changes?.ListKey //list key should be at least on one of them
    if(!listKey){
        throw new Error(`list key must be supplied either in the state or in the changes object`)
    }
    const listService = new ListService()
    const list = await listService.getList(listKey)
    const menu = new MenuBuilder().build(list.Menu, state, changes)
    res.json({Menu: menu})
})
//route for testing event
router.post('/OnClientLoadList', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes
    return res.json(await new LoadListEventService().execute(state, changes))
})

router.post('/drawMenuBlock', (req, res, next) => {
    if(Math.random() < 2){
        return res.json({
            Result: {
                Key: 'line',
                Title: 'line',
                DrawURL: 'addon-cpi/drawMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false
            }
         })
    }
    return res.json({
        Result: null
    })
})

