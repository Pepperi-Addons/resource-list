import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { IDataService } from '../metadata'
import { PepHttpService } from "@pepperi-addons/ngx-lib";
import { AddonData } from "@pepperi-addons/papi-sdk";
import { GenericResourceService } from "./generic-resource-service";

@Injectable({ providedIn: 'root' })
export class EditorsService implements IDataService{
    pluginUUID;
    name = "Editor"
    constructor(
        private utilitiesService: UtilitiesService,
        private pepHttp: PepHttpService,
        private genericResourceService: GenericResourceService
    ){
    }
    async getResources(): Promise<AddonData[]> {
        return (await this.genericResourceService.getResources()).filter(resource => resource.Type != 'papi')
    }
    async getItems(key: string = undefined, includeDeleted = false){
        let url = `/addons/api/${config.AddonUUID}/api/editors`
        let query = `?include_deleted=${includeDeleted}&where=Hidden=${includeDeleted}`
        if(key){
            query = query + ` AND Key='${key}'`
        }
        return await this.pepHttp.getPapiApiCall(url + query).toPromise()
    }
    async upsertItem(editor: any){
        return await this.pepHttp.postPapiApiCall(`/addons/api/${config.AddonUUID}/api/editors`, editor).toPromise()
    }
}