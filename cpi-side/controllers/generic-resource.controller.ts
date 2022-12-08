import { GenericResourceService } from "../services/generic-resource.service"


export async function getItems(req, res, next){
    try{
        const resource: string = req.params.resource
        const query = req.body.query
        const service = new GenericResourceService()
        return res.json(await service.getItems(resource, query))
    }
    catch(err){
        next(err)
    }
}

export async function postItem(req, res, next){
    try{
        const resource = req.params.resource
        const item = req.body 
        const service = new GenericResourceService()
        return res.json(await service.postItem(resource, item))
    }
    catch(err){
        next(err)
    }
}

export async function getResource(req, res, next){
    try{
        const resource = req.params.resource
        const service = new GenericResourceService()
        return res.json(await service.getResource(resource))
    }
    catch(err){
        next(err)
    }
}

export async function getAllResources(req, res, next){
    try{
        const service = new GenericResourceService()
        return res.json(await service.getAllResources())
    }
    catch(err){
        next(err)
    }
}