import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.routes'
import { router as viewsRouter } from './routes/views.routes'
import { MenuBuilder } from './events/helpers/menu-builder';
import { ListService } from './services/list.service';
import { DataRow, ListContainer, MenuBlock, loadListEventKey, menuClickEventKey, stateChangeEventKey, ViewBlock } from 'shared';
import { LoadListController } from './events/contorllers/load-list.controller';
import { StateChangeController } from './events/contorllers/state-change.controller';
import { MenuClickController } from './events/contorllers/menu-click.controller';
import { AddonsDataSearchResult } from '@pepperi-addons/cpi-node/build/cpi-side/client-api';
import { ResourceService } from './events/services/resource.service';
import { GenericResourceService } from './services/generic-resource.service';

export async function load(configuration: any) {
    //interceptors:
    pepperi.events.intercept(loadListEventKey as any, {}, async (data, next, main) => {
        return await LoadListController.loadList(data.State, data.Changes, data.List)
    })
    pepperi.events.intercept(stateChangeEventKey as any, {}, async (data, next, main) => {
        return await StateChangeController.onStateChanged(data.State, data.Changes, data.List)
    })
    pepperi.events.intercept(menuClickEventKey as any, {}, async (data, next, main) => {
        return await MenuClickController.onMenuClicked(data.State, data.Changes, data.List)
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
    if(!req.body){
        throw Error('on client load list endpoint - request must sent with a body')
    }

    return res.json(await LoadListController.loadList(req.body.State, req.body.Changes, req.body.List))
})

router.post('/onClientStateChange', async (req, res, next) => {
    if(!req.body){
        throw Error('on client state change endpoint - request must sent with a body')
    }
    return res.json(await StateChangeController.onStateChanged(req.body.State, req.body.Changes, req.body.List))
})

router.post('/drawGrid' ,async (req,res,next) => {
    const data: AddonsDataSearchResult['Objects'] = req.body.Data 
    const viewBlocks: ViewBlock[] = req.body.ViewBlocks
    const resource: string = req.body.Resource
    const grid: DataRow[] = []

    const resourceService = new ResourceService()
    //get fields of resource
    const resourceMetaData = await resourceService.getResourceFields(resource)
    const fields = resourceMetaData['Fields']
    if(!fields){
        throw Error(`in draw view blocks resource fields is undefined`)
    }
    //iterate over the fields
    data?.forEach(item => {
        const row: DataRow = {}
        viewBlocks.forEach(block => {
            let value = item[block.Configuration.FieldID]
            const field = fields[block.Configuration.FieldID]
            //if its an array we need to reformat the value
            if(field?.Type == "Array"){
                //array of complex object should be X items selected where x is the length of the array
                if(field?.Items?.Type == "Object" || field?.Items?.Type == "ContainedResource"){
                    value = `${value.length} items selected`
                }
                //array of simple values should be comma separated string
                else{
                    value = value.join(' , ')
                }
            }
            row[block.Configuration.FieldID] = value   
        })
        grid.push(row)
    })
    return res.json({ Data: grid })
    // //if fields is primitive array - comma separated string
    // //if field is objects array - X items selected
    // data?.forEach(item => {
    //     const row: DataRow = {}
    //     viewBlocks.forEach(block => {
    //            let value = item[block.Configuration.FieldID]
    //            if(block.Configuration.FieldID == "friends"){
    //                value = value.join(" , ")
    //            }
    //            row[block.Configuration.FieldID] = value    
    //    })
    //    grid.push(row)
    // })      
    // return res.json({ Data: grid })
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
            Hidden: false,
            ExecuteURL: 'addon-cpi/menuExecution'
        },
        {
            Key: 'import',
            Title: 'Import',
            DrawURL: 'addon-cpi/drawMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false,
            ExecuteURL: 'addon-cpi/menuExecution'
        },
        {
            Key: 'export',
            Title: 'Export',
            DrawURL: 'addon-cpi/drawMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false,
            ExecuteURL: 'addon-cpi/menuExecution'
        },
        {
            Key: 'new',
            Title: 'New',
            DrawURL: 'addon-cpi/drawMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false,
            ButtonStyleType: "Strong",
            ExecuteURL: 'addon-cpi/menuExecution'
        }
    ]
    return res.json({
        Result: blocks
    })
})


router.post('/menuExecution', (req, res, next) => {
    const state = req.body.State
    const key = req.body.Key
    const container: ListContainer = {State: {...state, SearchString: key}}
    return res.json(container)
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
            Hidden: false,
            ExecuteURL: 'addon-cpi/menuExecution'
        },
        {
            Key: 'delete',
            Title: 'Delete',
            DrawURL: 'addon-cpi/drawLineMenuBlock',
            AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
            Hidden: false,
            ExecuteURL: 'addon-cpi/menuExecution'
        }
    ]
    return res.json({
        Result: blocks
    })
})