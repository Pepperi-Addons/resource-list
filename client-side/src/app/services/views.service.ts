import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { Editor, View } from "../../../../shared/entities"



@Injectable({ providedIn: 'root' })
export class ViewsService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){
    }
    async getViews(key: string = undefined): Promise<View[]>{
        const query = key? {where:'Key=' + '"' + key + '"'} : undefined 
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('views').get(query)
    }
    async upsertView(view: View){
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('views').post(undefined,view)
    }
    async getEditors(key: string = undefined){
        const query = key? {where:'Key=' + '"' + key + '"'} : undefined
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('editors').get(query)
    }
    async upsertEditor(editor: Editor){
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('editors').post(undefined,editor)
    }
}