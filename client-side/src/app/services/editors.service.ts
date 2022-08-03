import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { IDataService } from '../metadata'
import { PepHttpService } from "@pepperi-addons/ngx-lib";

@Injectable({ providedIn: 'root' })
export class EditorsService implements IDataService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
        private pepHttp: PepHttpService
    ){
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