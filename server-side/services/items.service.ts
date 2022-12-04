import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "../addon.service";
import { ItemScheme } from "../metadata";
import { v4 as uuidv4 } from 'uuid';
import { FindOptions, Profile } from "@pepperi-addons/papi-sdk";
import { DataViewsService } from "./dataviews.service";
export abstract class ItemsService {
    addonService: AddonService = new AddonService(this.client);
    constructor(protected client: Client){
       
    }
    async getItems(options: FindOptions = {}){
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.getSchema().Name).find(options);
    }
    async getItemByKey(key: string){
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.getSchema().Name).key(key).get()
    }
    async postItem(item: any){
        if(item.Key == undefined){
            item.Key =  uuidv4()
            await this.postDefaultRepDataViews(item.Key)
        }
        return await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.getSchema().Name).upsert(item)
    }
    async createSchema(){
        return await this.addonService.papiClient.addons.data.schemes.post(this.getSchema());
    }
    async postDefaultRepDataViews(key: string){
        //key of data view cannot contain dashes
        key = key.replace(/-/g, '')
        const dataViewsService = new DataViewsService(this.client)
        const repProfiles = await this.addonService.papiClient.profiles.find({where: "Name='Rep'"})
        if(repProfiles && repProfiles.length > 0 && repProfiles[0].InternalID){
            await this.postDataViews(key, repProfiles[0].InternalID , dataViewsService)
        }
        else{
            throw new Error("error in" + this.getType() +  " service, inside postDefaultRepDataView function. reason: rep profile does not exist!!")
        }
    }
    async postDataViews(key: string, repProfileID: number, service: DataViewsService){
        await service.postDefaultDataView(key, repProfileID, this.getType())
    }

    abstract getType(): "view" | "editor"
    abstract getSchema(): ItemScheme
}

