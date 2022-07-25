import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { IDataService } from '../metadata'

@Injectable({ providedIn: 'root' })
export class EditorsService implements IDataService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){
    }
    async getItems(key: string = undefined, includeDeleted = false){
        const deletedQuery = includeDeleted? `Hidden=true` : `Hidden=false`
        const query: any = key? {where:'Key=' + '"' + key + '"' + " AND " + deletedQuery} : {where: deletedQuery}
        query.include_deleted = includeDeleted
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('editors').get(query)
    }
    async upsertItem(editor: any){
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('editors').post(undefined,editor)
    }
}