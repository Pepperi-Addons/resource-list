import { ViewsService } from "../services/views.service"

/**
 * get the generic view of a specific view
 * input: viewKey 
 * 
 * 
 */
export async function getGenericView(req, res, next){
    try{
        const key = req.query.Key
        const service  = new ViewsService()
        return  res.json(await service.getGenericView(key))
    }
    catch(err){
        next(err)
    }

}
/** 
 * get the selection list of specific view or the selection list of the default view
 * inputs: view key or resource key
 * output: if view is defined will return the selection list of the view, otherwise it will return the selection list of the default view of that resource.
*/
export async function getSelectionList(req, res, next){
    try{
        const resourceKey: string | undefined = req.query.Resource 
        const viewKey: string | undefined = req.query.Key 
        if(!resourceKey && !viewKey){
            throw new Error('request header must contain a generic viewer key  or a resource!')
        }
        const service = new ViewsService()
        return res.json(await service.getSelectionList(viewKey, resourceKey))
    }
    catch(err){
        next(err)
    }
}
