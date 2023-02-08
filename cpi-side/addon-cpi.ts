import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.routes'
import { router as viewsRouter } from './routes/views.routes'
import { getList } from './dummy-list';
import { MenuBuilder } from './events/models/helpers/menu-builder';
import { DrawnMenuBlock } from './configuration/models/menu.model';
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
    const currState = req.body.currState
    const prevState = req.body.prevState
    if(!currState || !currState.ListKey){
        throw new Error(`current state does not exist or does not have a list key`)
    }
    const list = await getList(currState.ListKey)
    res.json(await new MenuBuilder().build(list.Menu, currState, prevState))
})


