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
    async getItems(resourceName: string): Promise<any>{
        if(resourceName){
            return await this.utilitiesService.papiClient.resources.resource(resourceName).get()
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