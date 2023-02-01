import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.routes'
import { router as viewsRouter } from './routes/views.routes'
import { ListModelBuilder } from './client-events/load-list/helpers/list-builder';
import { buildListModel } from './client-events/load-list/controllers/load-list-event';
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

//route for testing event
router.get('/OnClientLoadList', async (req, res, next) => {
    const result =  await buildListModel({ListKey: 'LIST1'})
    return res.json(result)
})