import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "../addon.service";
import { ItemSchema } from "../metadata";
import { v4 as uuidv4 } from 'uuid';
import { FindOptions } from "@pepperi-addons/papi-sdk";
import { DataViewsService } from "../dataviews.service";
export abstract class ItemsService {
    addonService: AddonService = new AddonService(this.client);
    constructor(private client: Client){
        return this
    }
    async getItems(options: FindOptions = {}){
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.getSchema().Name).find(options);
    }
    async postItem(item: any){
        if(item.Key == undefined){
            item.Key =  uuidv4()
            await this.postDefaultRepDataView(item.Key)
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.getSchema().Name).upsert(item)
    }
    async createSchema(){
        return await this.addonService.papiClient.addons.data.schemes.post(this.getSchema());
    }
    async postDefaultRepDataView(key: string){
        const dataViewsService = new DataViewsService(this.client)
        const repProfiles = await this.addonService.papiClient.profiles.find({where: "Name='Rep'"})
        if(repProfiles && repProfiles.length > 0)
        {
            return await dataViewsService.postDefaultDataView(key, repProfiles[0].InternalID || 0, this.getType() )
        }
        else{
            throw new Error("error in" + this.getType() +  " service, inside postDefaultRepDataView function. reason: rep profile does not exist!!")
        }
    }

    abstract getType(): "view" | "editor"
    abstract getSchema(): ItemSchema
}

