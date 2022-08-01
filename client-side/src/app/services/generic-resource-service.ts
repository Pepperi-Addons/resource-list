import { Injectable } from "@angular/core";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class GenericResourceService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
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
        return await this.utilitiesService.papiClient.resources.resource('resources').key(name).get()
    }
}