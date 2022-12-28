import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { config } from "../addon.config";
import { GENERIC_RESOURCE_OFFLINE_URL, GENERIC_VIEWS_RESOURCE, IDataViewField } from "../metadata";
import { UtilitiesService } from "./utilities-service";




@Injectable({ providedIn: 'root' })
export class GenericResourceOfflineService{
    pluginUUID;
    constructor(
        private addonService: PepAddonService,
        private utilitiesService: UtilitiesService
    ){
    }
    async getResources(): Promise<any[]>{
        return await this.addonService.getAddonCPICall(config.AddonUUID,`${GENERIC_RESOURCE_OFFLINE_URL}/resources`) || []
    }
    async getItems(resourceName: string, getDeletedItems: boolean = false, fields: string[], filterQuery?: string): Promise<any>{
        try{
            let query = {where: `Hidden=${getDeletedItems}`, include_deleted: getDeletedItems}
            if(filterQuery){
                query.where += ` AND ${filterQuery}`
            }
            const keyFiledIndex = fields.findIndex(field => field == "Key")
            if(keyFiledIndex < 0){
                fields = [...fields, "Key"]
            }
           return (await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/get_items/${resourceName}`, {query: query, fields: fields})).Objects || []
        }catch(e){
            console.log(`error: ${e}`)
            return []
        }
    }
    async postItem(resourceName, item){
        return await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/post_item/${resourceName}`, item)
    }
    async getResource(name: string){
        return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/${name}`) as AddonDataScheme
    }


    async getResourceFields(resourceName: string): Promise<AddonDataScheme['Fields']>{
        const resource = await this.getResource(resourceName)
        return resource?.Fields || {}
    }
    async getGenericView(viewKey: string){
        return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/generic_view?Key=${viewKey}`)
    }
    async getSelectionList(viewKey?: string, resource?: string){
        if(viewKey){
            return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/selection_list?Key=${viewKey}`)
        }
        else if(resource){
            return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/selection_list?Resource=${resource}`)
        }
        else{
            return undefined
        }
    }
}