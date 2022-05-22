import UtilitiesService from './utilities.service'
import { Client, Request } from '@pepperi-addons/debug-server'

export async function get_all_collections(client: Client, request: Request){
    validateRequest('GET', request)
    const service = new UtilitiesService(client);
    return await service.getAllUDCCollections();
}
export async function get_collection_data(client: Client, request: Request){
    validateRequest('GET', request)
    if(!request?.query?.collectionName){
        throw new Error('collection name must be exist in request query, instead request query =  ' + request.query);
    }
    const service = new UtilitiesService(client)
    return await service.getCollectionDataByName(request.query.collectionName)
}
function validateRequest(method: string, request: Request){
    if(request.method != method){
        throw new Error(`expected to recive ${method} method, but instead recived ' + ${request.method}`);
    }
}
export async function view(client: Client, request: Request){
    const service = new UtilitiesService(client)
    if(request.method =='POST'){
        if(!request.body){
            throw new Error(`body must be exist when posting view, body: ${request.body}`)
        }
        return await service.postView(request.body)
    }
    else if(request.method === 'GET'){
        return await service.getView(request.query)
    }
    else{
        throw new Error(`expected to recive GET/POST method, but instead recived ' + ${request.method}`);
    }
    
}
