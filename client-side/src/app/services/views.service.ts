import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class ViewsService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){
    }
    async getViews(){
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('views').get()
    }
}