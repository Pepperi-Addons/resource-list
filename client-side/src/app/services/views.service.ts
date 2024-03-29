import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { View } from "shared"
import { IDataService } from "../metadata";
import { PepHttpService } from "@pepperi-addons/ngx-lib";
import { AddonData } from "@pepperi-addons/papi-sdk";
import { GenericResourceService } from "./generic-resource-service";
@Injectable({ providedIn: 'root' })
export class ViewsService implements IDataService{
    name = "View"
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
        private pepHttp: PepHttpService,
        private genericResourceService: GenericResourceService
    ){
    }
    async getItems(key: string = undefined, includeDeleted = false): Promise<View[]>{
        let url = `/addons/api/${config.AddonUUID}/api/views`
        let query = `?include_deleted=${includeDeleted}&where=Hidden=${includeDeleted}`
        if(key){
            query = query + ` AND Key='${key}'`
        }
        return await this.pepHttp.getPapiApiCall(url + query).toPromise()

    }
    async upsertItem(view: any){
        return await this.pepHttp.postPapiApiCall(`/addons/api/${config.AddonUUID}/api/views`, view).toPromise()
    }
    async getDefaultView(resourceName: string): Promise<View | undefined>{
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('get_default_view').get({resource: resourceName})
    }
    async getResources(): Promise<AddonData[]> {
        return  await this.genericResourceService.getResources()
    }
}