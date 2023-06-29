import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.routes'
import { router as viewsRouter } from './routes/views.routes'
import { MenuBuilder } from './events/helpers/menu-builder';
import { ListService } from './services/list.service';
import { DataRow, ListContainer, loadListEventKey, menuClickEventKey, stateChangeEventKey } from 'shared';
import { LoadListController } from './events/contorllers/load-list.controller';
import { StateChangeController } from './events/contorllers/state-change.controller';
import { MenuClickController } from './events/contorllers/menu-click.controller';
import { SearchBuilder } from './events/helpers/search-builder';
import { SmartSearchBuilder } from './events/helpers/smart-search-builder';
import { ViewsBuilder } from './events/helpers/views-menu-builder';
import { TitleBuilder } from './events/helpers/title-builder';
import { SelectionTypeBuilder } from './events/helpers/selection-type.builder';


//-----------------------------------------------------------------------
//                       Client Events Interceptors
//-----------------------------------------------------------------------

export async function load(configuration: any) {
    //interceptors:
    pepperi.events.intercept(loadListEventKey as any, {}, async (data, next, main) => {
        try{
            return await LoadListController.loadList(data.State, data.Changes, data.List)
        }
        catch(err){
            return {
                ErrorMessage: err instanceof Error? err.message : 'Unknown Error'
            }
        }
    })
    pepperi.events.intercept(stateChangeEventKey as any, {}, async (data, next, main) => {
        try{
            return await StateChangeController.onStateChanged(data.State, data.Changes, data.List)
        }
        catch(err){
            return {
                ErrorMessage: err instanceof Error? err.message : 'Unknown Error'
            }
        }
    })
    pepperi.events.intercept(menuClickEventKey as any, {}, async (data, next, main) => {
        try{
            return await MenuClickController.onMenuClicked(data.State, data.Key, data.List, data?.client?.context)
        }
        catch(err){
            return {
                ErrorMessage: err instanceof Error? err.message : 'Unknown Error'
            }
        }
    })
}

export const router = Router()

//-----------------------------------------------------------------------
//                        Routes
//-----------------------------------------------------------------------

//generic resources routes:
router.use('/resources', genericResourceRouter)

//views routes:
router.use('/views', viewsRouter)



//-----------------------------------------------------------------------
//                        Routes For Testing Client Events
//-----------------------------------------------------------------------


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

//-----------------------------------------------------------------------
//                        Draw Grid Function
//-----------------------------------------------------------------------

router.post('/drawGrid' ,async (req,res,next) => {
    const data = req.body.Data 
    const viewBlocks = req.body.ViewBlocks
    const grid: DataRow[] = []
    data?.forEach(item => {
        const row: DataRow = {}
        viewBlocks.forEach(block => {
               let value = item[block.Configuration.FieldID]
               if(block.Configuration.FieldID == "friends"){
                   value = value.join(" , ")
               }
               row[block.Configuration.FieldID] = value    
       })
       //add key to the row, because key should always exist
       row.Key = item.Key
       grid.push(row)
    })      
    return res.json({ Data: grid })
})

//-----------------------------------------------------------------------
//                        Menu Blocks Draw Functions
//-----------------------------------------------------------------------

router.post('/drawScrollMenuBlock', (req, res, next) => {
    return res.json({
        Result: [
            {
                Key: 'scroll',
                Title: 'Scroll',
                DrawURL: 'addon-cpi/drawScrollMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false,
                ExecuteURL: 'addon-cpi/scrollExecution'
            }
        ]
    })
})

router.post('/drawImportMenuBlock', (req, res, next) => {
    return res.json({
        Result: [
            {
                Key: 'import',
                Title: 'Import',
                DrawURL: 'addon-cpi/drawImportMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false,
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    })
})

//drawing export menu block function
router.post('/drawExportMenuBlock', (req, res, next) => {
    return res.json({
        Result: [
            {
                Key: 'export',
                Title: 'Export',
                DrawURL: 'addon-cpi/drawExportMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false,
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    }) 
})

//drawing recycle bin block function
router.post('/drawRecycleBinMenuBlock', (req, res, next) => {
    return res.json({            
        Result: [
            {
                Key: 'recycleBin',
                Title: 'Recycle Bin',
                DrawURL: 'addon-cpi/drawRecycleBinMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false,
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    })
})

//drawing new button block function
router.post('/drawNewButtonMenuBlock', (req, res, next) => {
    return res.json({
        Result: [
            {
                Key: 'new',
                Title: 'New',
                DrawURL: 'addon-cpi/drawNewButtonMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false,
                ButtonStyleType: "Strong",
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    })
})

//-----------------------------------------------------------------------
//                        Line Menu Blocks Draw Functions
//-----------------------------------------------------------------------

router.post('/drawEditLineMenuBlock', (req, res, next) => {
    const changes = req.body.Changes
    //we will draw line menu block only when exactly one line is selected
    const numOfSelectedItems = changes?.ItemSelection?.Items?.length || 0
    
    if(numOfSelectedItems != 1){
        return res.json({
            Result: null
        })
    }
    return res.json({
        Result: [
            {
                Key: 'edit',
                Title: 'Edit',
                DrawURL: 'addon-cpi/drawEditLineMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false,
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    })
})

router.post('/drawDeleteLineMenuBlock', (req, res, next) => {
    const changes = req.body.Changes
    //we will draw line menu block only when exactly one line is selected
    const numOfSelectedItems = changes?.ItemSelection?.Items?.length || 0
    
    if(numOfSelectedItems != 1){
        return res.json({
            Result: null
        })
    }
    return res.json({
        Result: [
            {
                Key: 'delete',
                Title: 'Delete',
                DrawURL: 'addon-cpi/drawDeleteLineMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                Hidden: false,
                ExecuteURL: 'addon-cpi/menuExecution'
            }
        ]
    })
})

//-----------------------------------------------------------------------
//                        Menu Block Execution Function
//-----------------------------------------------------------------------

router.post('/menuExecution', (req, res, next) => {
    const state = req.body.State
    const key = req.body.Key
    const container: ListContainer = {State: {...state, SearchString: key}}
    return res.json(container)
})

router.post('/scrollExecution', (req, res, next) => {
    const state = req.body.State
    const key = req.body.Key
    const container: ListContainer = {State: {...state, TopScrollIndex: 29}}
    return res.json(container)
})

//-----------------------------------------------------------------------
//                        Endpoints For Testing
//-----------------------------------------------------------------------

router.post('/search_test', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes || {}
    const listKey = state?.ListKey || changes?.ListKey //list key should be at least on one of them
    if(!listKey && !req.body.List){
        throw new Error(`list or list key needs to be supplied`)
    }
    const listService = new ListService()
    const list = req.body.List || await listService.getList(listKey)
    const searchBuilder = new SearchBuilder()
    
    return res.json({
        Result: searchBuilder.build(list, state, changes)
    })
})

router.post('/smart_search_test', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes || {}
    const listKey = state?.ListKey || changes?.ListKey //list key should be at least on one of them
    if(!listKey && !req.body.List){
        throw new Error(`list or list key needs to be supplied`)
    }
    const listService = new ListService()
    const list = req.body.List || await listService.getList(listKey)
    const smartSearchBuilder = new SmartSearchBuilder()
    
    return res.json({
        Result: smartSearchBuilder.build(list, state, changes)
    })
})

router.post('/views_test', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes || {}
    const listKey = state?.ListKey || changes?.ListKey //list key should be at least on one of them
    if(!listKey && !req.body.List){
        throw new Error(`list or list key needs to be supplied`)
    }
    const listService = new ListService()
    const list = req.body.List || await listService.getList(listKey)
    const viewsBuilder = new ViewsBuilder()
    
    return res.json({
        Result: viewsBuilder.build(list, state, changes)
    })
})

router.post('/title_test', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes || {}
    const listKey = state?.ListKey || changes?.ListKey //list key should be at least on one of them
    if(!listKey && !req.body.List){
        throw new Error(`list or list key needs to be supplied`)
    }
    const listService = new ListService()
    const list = req.body.List || await listService.getList(listKey)
    const titleBuilder = new TitleBuilder()
    
    return res.json({
        Result: titleBuilder.build(list, state, changes)
    })
})

router.post('/selection_type_test', async (req, res, next) => {
    const state = req.body.State
    const changes = req.body.Changes || {}
    const listKey = state?.ListKey || changes?.ListKey //list key should be at least on one of them
    if(!listKey && !req.body.List){
        throw new Error(`list or list key needs to be supplied`)
    }
    const listService = new ListService()
    const list = req.body.List || await listService.getList(listKey)
    const selectionTypeBuilder = new SelectionTypeBuilder()
    
    return res.json({
        Result: selectionTypeBuilder.build(list, state, changes)
    })
})

router.post('/menu_test', async (req, res, next) => {
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
