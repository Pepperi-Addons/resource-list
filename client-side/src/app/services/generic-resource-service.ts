import { Injectable } from "@angular/core";
import { PepAddonService, PepHttpService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { config } from "../addon.config";
import { defaultCollectionFields, GENERIC_RESOURCE_OFFLINE_URL, GENERIC_VIEWS_RESOURCE, IDataViewField } from "../metadata";
import { TypeMap } from "shared";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class GenericResourceService{
    pluginUUID;
    constructor(
        private addonService: PepAddonService,
        private utilitiesService: UtilitiesService,
        private pepHttp: PepHttpService
    ){
    }
    async getResources(): Promise<any[]>{
        return await this.utilitiesService.papiClient.resources.resource('resources').get()
    }
    async getItems(resourceName: string, getDeletedItems: boolean = false, filterQuery?: string): Promise<any>{
        try{
            let query = {where: `Hidden=${getDeletedItems}`, include_deleted: getDeletedItems}
            if(filterQuery){
                query.where += ` AND ${filterQuery}`
            }
            return await this.utilitiesService.papiClient.resources.resource(resourceName).get(query)
        }catch(e){
            return []
        }
    }
    async postItem(resourceName, item){
        return await this.utilitiesService.papiClient.resources.resource(resourceName).post(item)
    }
    async getResource(name: string){
        return await this.utilitiesService.papiClient.resources.resource('resources').key(name).get() as AddonDataScheme
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

    async getResourceFieldsIncludeReferenceFields(resourceName: string){
        return [...await this.addonService.getAddonApiCall(config.AddonUUID, 'api', `get_resource_fields_and_references_fields?ResourceName=${resourceName}`).toPromise(), ...defaultCollectionFields]
    }

    async getGenericView(viewKey: string){
        let url = `/addons/api/${config.AddonUUID}/api/get_generic_view?Key=${viewKey}`
        return await this.pepHttp.getPapiApiCall(url).toPromise()
    }
    async getSelectionList(viewKey?: string, resource?: string){
        let url = `/addons/api/${config.AddonUUID}/api/get_selection_list?`
        if(viewKey){
            return await this.pepHttp.getPapiApiCall(url + `Key=${viewKey}`).toPromise()
        }
        else if(resource){
            return await this.pepHttp.getPapiApiCall(url + `Resource=${resource}`).toPromise()
        }
        else{
            return undefined
        }
    }
}