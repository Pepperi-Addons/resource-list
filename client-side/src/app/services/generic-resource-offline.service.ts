import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme, GridDataViewField } from "@pepperi-addons/papi-sdk";
import { config } from "../addon.config";
import { GENERIC_RESOURCE_OFFLINE_URL, GENERIC_VIEWS_RESOURCE, IDataViewField } from "../metadata";
import { UtilitiesService } from "./utilities-service";
import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { toApiQueryString } from '@pepperi-addons/pepperi-filters'
import { SmartSearchParser } from "../smart-search-parser/smart-search-parser";



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
    async getItems(resourceName: string, getDeletedItems: boolean = false, fields: string[], filterQuery?: string, params?: IPepGenericListParams, dataViewFields?: GridDataViewField[]): Promise<any>{
        try{
            let query = {where: `Hidden=${getDeletedItems}`, include_deleted: getDeletedItems}
            if(params?.filters && params?.filters.length > 0 && dataViewFields){
                const jsonFilterQuery = new SmartSearchParser(params.filters, dataViewFields).toString()
                query.where += ` AND ${jsonFilterQuery}`
            }
            if(filterQuery){
                query.where += ` AND ${filterQuery}`
            }
           return (await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/get_items/${resourceName}`, {query: query, fields: [...fields, "Key"]})).Objects || []
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