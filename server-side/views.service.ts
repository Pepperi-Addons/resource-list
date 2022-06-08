import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "./addon.service";
import { editorsTable, viewsTable } from "./metadata";
import { v4 as uuidv4 } from 'uuid';
import { FindOptions } from "@pepperi-addons/papi-sdk";

export class ViewsService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(private client: Client) {}
    
    async getViews(options: FindOptions = {}){
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).find(options);
    }
    async postView(view: any){
        if(!view.Key){
            view.Key =  uuidv4()
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).upsert(view)
    }
    async getEditors(options){
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(editorsTable.Name).find(options)

    }
    async postEditor(editor: any){
        if(!editor.key){
            editor.Key = uuidv4()
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(editorsTable.Name).upsert(editor) 
    }
    async createViewsTable(){
        return await this.addonService.papiClient.addons.data.schemes.post(viewsTable);
    }
    async createEditorsTable(){
        return await this.addonService.papiClient.addons.data.schemes.post(editorsTable)
    }
}
