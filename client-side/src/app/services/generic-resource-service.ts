import { Injectable } from "@angular/core";
import { PepHttpService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { IGenericViewer } from "../../../../shared/entities";
import { config } from "../addon.config";
import { defaultCollectionFields, IDataViewField } from "../metadata";
import { TypeMap } from "../type-map";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class GenericResourceService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
        private pepHttp: PepHttpService
    ){
    }
    async getResources(): Promise<any[]>{
        return await this.utilitiesService.papiClient.resources.resource('resources').get()
    }
    async getItems(resourceName: string, getDeletedItems: boolean = false): Promise<any>{
        let query = undefined
        if(getDeletedItems){
            query = {where: 'Hidden=true'}
            query.include_deleted = true
        }
        if(resourceName){
            return await this.utilitiesService.papiClient.resources.resource(resourceName).get(query)
        }
        return [];
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