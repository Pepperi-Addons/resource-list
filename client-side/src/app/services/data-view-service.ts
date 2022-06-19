import { Injectable } from "@angular/core";
import { DataView, GridDataView } from "@pepperi-addons/papi-sdk";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class DataViewService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){}
    async getDataViews(viewKey: string){
        const query = {where: `Context.Name="GV_${viewKey}_View"`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query) as GridDataView[]
    }
    async postDataView(dataView: DataView){
        const result =  await this.utilitiesService.papiClient.metaData.dataViews.upsert(dataView)
        return result as GridDataView
    }
    async getDataViewsByProfile(viewKey: string, profileName: string){
        const query = {where: `Context.Name="GV_${viewKey}_View" AND Context.Profile.Name="Rep"`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query) as GridDataView[]
    }
}