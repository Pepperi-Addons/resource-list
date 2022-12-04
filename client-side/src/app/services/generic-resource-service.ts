import { Injectable } from "@angular/core";
import { PepAddonService, PepHttpService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { IGenericViewer } from "../../../../shared/entities";
import { config } from "../addon.config";
import { defaultCollectionFields, GENERIC_RESOURCE_OFFLINE_URL, GENERIC_VIEWS_RESOURCE, IDataViewField } from "../metadata";
import { TypeMap } from "../type-map";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class GenericResourceService{
    pluginUUID;
    constructor(
        private addonService: PepAddonService
    ){
    }
    async getResources(): Promise<any[]>{
        return await this.addonService.getAddonCPICall(config.AddonUUID,`${GENERIC_RESOURCE_OFFLINE_URL}/resources`) || []
    }
    async getItems(resourceName: string, getDeletedItems: boolean = false, filterQuery?: string): Promise<any>{
        try{
            let query = {where: `Hidden=${getDeletedItems}`, include_deleted: getDeletedItems}
            if(filterQuery){
                query.where += ` AND ${filterQuery}`
            }
           return await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/get_items/${resourceName}`, {query: query})
        }catch(e){
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
    async getResourceFieldsAsDataViewFields(resourceName: string){
        const resource = await this.getResource(resourceName)
        const typeMap = new TypeMap()
        const fields: IDataViewField[] = Object.keys(resource.Fields).map(fieldID => {
          return {
            FieldID: fieldID,
            Mandatory: true,
            ReadOnly: true,
            Title: fieldID,
            Type: typeMap.get(resource.Fields[fieldID].Type)
          }
        })
        return  [...fields, ...defaultCollectionFields ]
    }
    async getGenericView(viewKey: string){
        const result =  await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/generic_view?Key=${viewKey}`)
        return result
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