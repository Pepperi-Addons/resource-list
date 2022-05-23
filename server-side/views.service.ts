import { Client } from "@pepperi-addons/debug-server/dist";
import AddonsService from "./addons.service";
import { viewsTable } from "./metadata";
import { v4 as uuidv4 } from 'uuid';

export class ViewsService {  
    addonsService: AddonsService = new AddonsService(this.client);

    constructor(private client: Client) {}
    async getViews(options: any){
        if(!options){
            throw new Error(`must send Key in order to get view`);
        }
        return await this.addonsService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).find(options);
    }
    async postView(view: any){
        if(!view.Key){
            view.Key =  uuidv4()
        }
        return await this.addonsService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).upsert(view)
    }
    async createViewsTable(){
        return await this.addonsService.papiClient.addons.data.schemes.post(viewsTable);
    }
}
