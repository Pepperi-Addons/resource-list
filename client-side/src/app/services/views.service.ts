import { Injectable } from "@angular/core";
import { config } from "../addon.config";
import { UtilitiesService } from './utilities-service'
import { View } from "../../../../shared/entities"
import { IDataService } from "../metadata";

@Injectable({ providedIn: 'root' })
export class ViewsService implements IDataService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){
    }
    async getItems(key: string = undefined, includeDeleted = false): Promise<View[]>{
        const deletedQuery = includeDeleted? `Hidden=true` : `Hidden=false`
        const query: any = key? {where:'Key=' + '"' + key + '"' + " AND " + deletedQuery} : {where: deletedQuery}
        query.include_deleted = includeDeleted 
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('views').get(query)
    }
    async upsertItem(view: any){
        return await this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('views').post(undefined,view)
    }
}