import { PapiClient, InstalledAddon, FindOptions } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { isView, View, viewsTable } from './metadata'
import { v4 as uuidv4 } from 'uuid';
import { debug } from 'console';

class UtilitiesService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    doSomething() {
        console.log("doesn't really do anything....");
    }
    
    // For page block template
    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }
    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }
    getAllUDCCollections(): Promise<any>{
        return this.papiClient.userDefinedCollections.schemes.find()
    }
    getCollectionDataByName(collectionName: string){
        return this.papiClient.userDefinedCollections.documents(collectionName).find()
    }
    async createViewsTable(){
        return await this.papiClient.addons.data.schemes.post(viewsTable);
    }
    async getViews(options: any){
        if(!options){
            throw new Error(`must send Key in order to get view`);
        }
        return await this.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).find(options);
    }
    async postView(view: any){
        view.Key =  uuidv4()
        if(!isView(view)){
            throw new Error(`must send object with type of View inside the body, body: ${view}`)
        }
        return await this.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).upsert(view)
    }

    
}

export default UtilitiesService;