import { Injectable } from "@angular/core";
import { PepJwtHelperService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class UDCService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){
    }
    async getCollections(): Promise<any[]>{
        return await this.utilitiesService.papiClient.addons.api.uuid(this.pluginUUID).file('api').func('get_all_collections').get()
    }
    async getAllResources(resourceType: string){
        if(resourceType == 'UDC'){
            return await this.getCollections()
        }
    }
    async getItems(resourceName: string): Promise<any>{
        if(resourceName){
            return await this.utilitiesService.papiClient.userDefinedCollections.documents(resourceName).find();
        }
        return [];
    }
    async postItem(resourceName, item){
        try{
            const res = await this.utilitiesService.papiClient.userDefinedCollections.documents(resourceName).upsert(item)
            return res
        }
        catch(e){
            console.error(`try to post item:\n${item}\n to resource:\n${resourceName}\nin UDC, end with error:\n ${e}`)
        }
    }
}