import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { View } from "../../../../shared/entities"



@Injectable({ providedIn: 'root' })
export class ViewsService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){
    }
    async getViews(key = undefined): Promise<View[]>{
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('views').get({Key: key})
    }
    async updateView(view: View){
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('views').post(undefined,view)
    }
}