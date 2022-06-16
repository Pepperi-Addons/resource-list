import { Injectable } from "@angular/core";
import { DataView } from "@pepperi-addons/papi-sdk";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class DataViewService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){}
    async getDataViews(viewKey: string){
        const query = {where: `Context.Name="GV_${viewKey}_View"`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query)
    }
    async postDataView(dataView: DataView){
        const result =  await this.utilitiesService.papiClient.metaData.dataViews.upsert(dataView)
        return result
    }
    async getRepDataView(viewKey: string){
        const query = {where: `Context.Name="GV_${viewKey}_View" AND Context.Profile.Name="Rep"`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query)
    }
}