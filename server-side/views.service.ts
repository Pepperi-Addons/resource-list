import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "./addon.service";
import { editorsTable, viewsTable } from "./metadata";
import { v4 as uuidv4 } from 'uuid';
import { FindOptions } from "@pepperi-addons/papi-sdk";
import { DataViewsService } from "./dataviews.service";

export class ViewsService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(
        private client: Client,
        )
        {

        }
    
    async getViews(options: FindOptions = {}){
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).find(options);
    }
    async postView(view: any){
        if(!view.Key){
            view.Key =  uuidv4().replace(/-/g, '')
            await this.postDefaultRepDataView(view.Key, "view")
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(viewsTable.Name).upsert(view)
    }
    async getEditors(options){
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(editorsTable.Name).find(options)

    }
    async postEditor(editor: any){
        if(!editor.Key){
            editor.Key = uuidv4().replace(/-/g, '')
            await this.postDefaultRepDataView(editor.Key, "editor")
            debugger
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(editorsTable.Name).upsert(editor) 
    }
    async createViewsTable(){
        return await this.addonService.papiClient.addons.data.schemes.post(viewsTable);
    }
    async createEditorsTable(){
        return await this.addonService.papiClient.addons.data.schemes.post(editorsTable)
    }

    async postDefaultRepDataView(key: string, type: "view" | "editor"){
        const dataViewsService = new DataViewsService(this.client)
        const repProfiles = await this.addonService.papiClient.profiles.find({where: "Name='Rep'"})
        if(repProfiles && repProfiles.length > 0)
        {
            return await dataViewsService.postDefaultDataView(key, repProfiles[0].InternalID || 0, repProfiles[0].Name || "" , type )
        }
        else{
            throw new Error("error in views service, inside postDefaultRepDataView function. reason: rep profile does not exist!!")
        }
        

    }
}
