import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "./addon.service";
import { viewsTable } from "./metadata";
import { v4 as uuidv4 } from 'uuid';

export class ViewsService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(private client: Client) {}
    async getViews(options: any){
        if(!options){
            throw new Error(`must send Key in order to get view`);
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).find(options);
    }
    async postView(view: any){
        if(!view.Key){
            view.Key =  uuidv4()
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).upsert(view)
    }
    async createViewsTable(){
        return await this.addonService.papiClient.addons.data.schemes.post(viewsTable);
    }
}
