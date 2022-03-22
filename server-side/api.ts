import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'

export async function get_all_collections(client: Client, request: Request){
    validateRequest('GET', request)
    const service = new MyService(client);
    return await service.getAllUDCCollections();
}
export async function get_collection_data(client: Client, request: Request){
    validateRequest('GET', request)
    if(!request?.query?.collectionName){
        throw new Error('collection name must be exist in request body, instead request query =  ' + request.query);
    }
    const service = new MyService(client)
    return await service.getCollectionDataByName(request.query.collectionName)
}
function validateRequest(method: string, request: Request){
    if(request.method != method){
        throw new Error(`expected to recive ${method} method, but instead recived ' + request.method`);
    }
}
