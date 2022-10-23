import { Client, Request } from '@pepperi-addons/debug-server'
import { ViewsService } from './services/views.service';
import { EditorsService } from './services/editors.service';
import { UDCService } from './udc.service';
import { GenericViewService } from './services/generic-view.service';

export async function get_all_collections(client: Client, request: Request){
    validateRequest('GET', request)
    const service = new UDCService(client);
    return await service.getAllUDCCollections();
}
export async function get_collection_data(client: Client, request: Request){
    validateRequest('GET', request)
    if(!request?.query?.collectionName){
        throw new Error('collection name must be exist in request query, instead request query =  ' + request.query);
    }
    const service = new UDCService(client)
    return await service.getCollectionDataByName(request.query.collectionName)
}
function validateRequest(method: string, request: Request){
    if(request.method != method){
        throw new Error(`expected to receive ${method} method, but instead received ' + ${request.method}`);
    }
}
export async function views(client: Client, request: Request){
    const service = new ViewsService(client)
    if(request.method =='POST'){
        if(!request.body){
            throw new Error(`body must be exist when posting view, body: ${request.body}`)
        }
        return await service.postItem(request.body)
    }
    else if(request.method === 'GET'){
        return await service.getItems(request.query)
    }
    else{
        throw new Error(`expected to receive GET/POST method, but instead received ' + ${request.method}`);
    }
}
export async function  get_default_view(client: Client, request: Request){
    if(!request.query || !request.query.resource){
        throw new Error('there is no resource that sent in the query')
    }
    const service = new ViewsService(client)
    return await service.getDefaultView(request.query.resource)
}
export async function get_generic_view(client: Client, request: Request){
    validateRequest('GET', request)
    const key = request.query.Key 
    if(!key){
        throw new Error('request header must contain a generic viewer key')
    }
    const service = new GenericViewService(client)
    return await service.getGenericView(key)
}

export async function get_selection_list(client: Client, request: Request){
    validateRequest('GET', request)
    const key = request.query.Key
    const isDefaultView = request.query.IsDefaultView
    if(!key){
        throw new Error('request header must contain a generic viewer key')
    }
    const service = new GenericViewService(client)
    return await service.getSelectionList(key, isDefaultView)
}

export async function editors(client: Client, request: Request){
    const service = new EditorsService(client);
    if(request.method === 'POST'){
        if(!request.body){
            throw new Error('body must be exist when posting editor, body: ' + request.body)
        }
        return await service.postItem(request.body)
    }
    else if(request.method === 'GET'){
        return await service.getItems(request.query)
    }
    else{
        throw new Error(`expected to receive GET/POST method, but instead received ' + ${request.method}`);
    }
}

