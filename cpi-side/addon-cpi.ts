import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.routes'
import { router as viewsRouter } from './routes/views.routes'
import { MenuBuilder } from './events/helpers/menu-builder';
import { ListService } from './services/list.service';
import { MenuBlock } from './models/events/list-layout.model';
import { LoadListEventService } from './events/services/load-list-event.service';
import { Row } from './events/metadata';
import { ListState } from './models/events/list-state.model';
import { ChangeStateEventService } from './events/services/state-change-event.service';
export async function load(configuration: any) {


    //interceptors:

    pepperi.events.intercept('OnClientLoadList' as any, {}, async (data, next, main) => {
        try{
            const state = data.State
            const changes = data.Changes
            if(!changes || !changes.ListKey){
                throw Error(`changes is required and needs to contain ListKey`)
            }
            return await new LoadListEventService().execute(state, changes)
        }catch(err){
            throw Error(`error inside OnClientLoadList event: ${err}`)
        }
    })
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
    const menu = await new MenuBuilder().build(list.Menu, state, changes)
    res.json({Menu: menu})
})
//route for testing event
router.post('/OnClientLoadList', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes

    return res.json(await new LoadListEventService().execute(state, changes))
})

router.post('/onClientStateChange', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes
    if(!state?.ViewKey || !state?.ListKey){
        throw Error(`in client state change event -list key and view key must be exist in the state object`)
    }
    return res.json(await new ChangeStateEventService().execute(state, changes))
})

router.post('/drawGrid' ,async (req,res,next) => {
    const data = req.body.Data 
    const viewBlocks = req.body.ViewBlocks
    const grid: Row[] = []
    data?.forEach(item => {
        const row: Row = {}
        viewBlocks.forEach(block => {
               let value = item[block.Configuration.FieldID]
               if(block.Configuration.FieldID == "friends"){
                   value = value.join(" , ")
               }
               row[block.Configuration.FieldID] = value    
       })
       grid.push(row)
    })      
    return res.json({ GridData: grid })
})

router.post('/drawMenuBlock', (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes
    if(!changes?.ListKey){
        return res.json({
            Result: null
        })
    }
    const blocks: MenuBlock[] = [
        {
            Key: 'recycleBin',
            Title: 'Recycle Bin',
            DrawURL: 'addon-cpi/drawMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false
        },
        {
            Key: 'import',
            Title: 'Import',
            DrawURL: 'addon-cpi/drawMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false
        },
        {
            Key: 'export',
            Title: 'Export',
            DrawURL: 'addon-cpi/drawMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false
        },
        {
            Key: 'new',
            Title: 'New',
            DrawURL: 'addon-cpi/drawMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false,
            ButtonStyleType: "Strong"
        }
    ]
    return res.json({
        Result: blocks
    })
})



router.post('/drawLineMenuBlock', (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes

    //we will draw line menu block only when exactly one line is selected
    const numOfSelectedItems = changes?.ItemSelection?.Items?.length || 0
    if(numOfSelectedItems != 1){
        return res.json({
            Result: null
        })
    }
    const blocks: MenuBlock[] = [
        {
            Key: 'edit',
            Title: 'Edit',
            DrawURL: 'addon-cpi/drawLineMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false
        },
        {
            Key: 'delete',
            Title: 'Delete',
            DrawURL: 'addon-cpi/drawLineMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false
        }
    ]
    return res.json({
        Result: blocks
    })
})

router.post('/drawLineMenuBlock', (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes

    //we will draw line menu block only when exactly one line is selected
    const numOfSelectedItems = changes?.ItemSelection?.Items?.length || 0
    if(numOfSelectedItems != 1){
        return res.json({
            Result: null
        })
    }
    const blocks: MenuBlock[] = [
        {
            Key: 'edit',
            Title: 'Edit',
            DrawURL: 'addon-cpi/drawLineMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false
        },
        {
            Key: 'delete',
            Title: 'Delete',
            DrawURL: 'addon-cpi/drawLineMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false
        }
    ]
    return res.json({
        Result: blocks
    })
})