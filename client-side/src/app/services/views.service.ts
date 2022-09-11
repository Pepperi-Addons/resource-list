import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { View } from "../../../../shared/entities"
import { IDataService } from "../metadata";
import { PepHttpService } from "@pepperi-addons/ngx-lib";
@Injectable({ providedIn: 'root' })
export class ViewsService implements IDataService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
        private pepHttp: PepHttpService
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
    async getDefaultView(resourceName: string){
        const views = await this.getItems()
        const viewsOfResource = views.filter(view => view.Resource.Name == resourceName)
        const defaultView =  viewsOfResource.sort((a,b) => new Date(a.CreationDateTime).getTime() - new Date(b.CreationDateTime).getTime())
        if(defaultView.length > 0){
            return defaultView[0]
        }
        return undefined
    }
}