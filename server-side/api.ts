import { Client, Request } from '@pepperi-addons/debug-server'
import { ViewsService } from './services/views.service';
import { EditorsService } from './services/editors.service';
import { UDCService } from './udc.service';
import { GenericViewerService } from './services/generic-viewer.service';
import { AddonDataScheme, PapiClient } from '@pepperi-addons/papi-sdk';

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
    if(request.method != 'GET'){
        throw new Error('request should be a GET method')
    }
    if(!request.query || !request.query.resource){
        throw new Error('there is no resource that sent in the query')
    }
    const service = new ViewsService(client)
    return await service.getDefaultView(request.query.resource)
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

export async function get_generic_view(client: Client, request: Request){
    validateRequest('GET', request)
    const key = request.query.Key
    if(!key){
        throw new Error('request header must contain a generic viewer key')
    }
    const service = new GenericViewerService(client)
    return await service.getGenericView(key)
}
/**
 * POST endpoint
 * this is a post endpoint because in get request the url cannot be more than 2048 bytes
 * body:{
 * dataView: GridDataView
 * }
 * output:
    for each reference fields return all the fields of the resource that the field refer to
 */
export async function get_resource_fields_and_references_fields(client: Client, request: Request){
    validateRequest('GET', request)
    const resourceName: string = request.query.ResourceName
    const service = new GenericViewerService(client)
    return await service.getResourceFieldsWithRefFieldsAsDataViewFields(resourceName)
}

export async function get_selection_list(client: Client, request: Request){
    validateRequest('GET', request)
    const key = request.query.Key
    const resource = request.query.Resource
    if(!key && !resource){
        throw new Error('request header must contain a generic viewer key  or a resource!')
    }
    const service = new GenericViewerService(client)
    return await service.getSelectionList(key, resource)
}

export async function get_search_fields_for_resource(client: Client, request: Request) {
    validateRequest('GET', request);
    const resourceName = request.query.resource_name;
    if (!resourceName) {
        throw new Error('resource_name cannot be empty');
    }
    else {
        const service = new GenericViewerService(client);
        return await service.GetResourceSearchFields(resourceName);
    }
}


export async function get_resource_fields(client: Client, request: Request){
    const papiClient = new PapiClient({
        baseURL: client.BaseURL,
        token: client.OAuthAccessToken,
        addonUUID: client.AddonUUID,
        addonSecretKey: client.AddonSecretKey,
        actionUUID: client.ActionUUID
    })
    const resource = await papiClient.resources.resource('resources').key(request.query.Name).get() as AddonDataScheme
    return resource?.Fields || {}
}

