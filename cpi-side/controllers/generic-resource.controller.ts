import { GenericResourceService } from "../services/generic-resource.service"


export async function getItems(req, res, next){
    try{
        const resource: string = req.params.resource
        const service = new GenericResourceService()
        return res.json(await service.getItems(resource))
    }
    catch(next){}
}

export async function postItem(req, res, next){
    try{
        const resource = req.params.resource
        const item = req.body 
        const service = new GenericResourceService()
        return res.json(await service.postItem(resource, item))
    }
    catch(next){}
}

export async function getResource(req, res, next){
    const resource = req.params.resource
    const service = new GenericResourceService()
    return res.json(await service.getResource(resource))
}