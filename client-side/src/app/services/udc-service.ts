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
    async getItems(resourceName: string): Promise<any>{
        if(resourceName){
            return await this.utilitiesService.papiClient.userDefinedCollections.documents(resourceName).find();
        }
        return [];
    }
    async postItem(resourceName, item){
        const res = await this.utilitiesService.papiClient.userDefinedCollections.documents(resourceName).upsert(item)
        return res
    }
    async getCollection(name: string){
        return await this.utilitiesService.papiClient.userDefinedCollections.schemes.name(name).get()
    }
}