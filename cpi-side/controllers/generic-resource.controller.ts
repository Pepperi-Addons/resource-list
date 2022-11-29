import { GenericResourceService } from "../services/generic-resource.service"


export async function getItems(req, res, next){
    try{
        const resource: string = req.params.resource
        const filterQuery: string = req.body.filterQuery || ''
        const onlyDeletedItems: boolean = req.body.onlyDeletedItems || false //if onlyDeletedItems is undefined then set it to false
        const service = new GenericResourceService()
        return res.json(await service.getItems(resource, filterQuery, onlyDeletedItems))
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