import { Injectable } from "@angular/core";
import { DataView, GridDataView } from "@pepperi-addons/papi-sdk";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class DataViewService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){}
    async getDataViews(key: string){
        const query = {where: `Context.Name=${key}`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query)
    }
    async postDataView(dataView: DataView){
        const result =  await this.utilitiesService.papiClient.metaData.dataViews.upsert(dataView)
        return result as GridDataView
    }
    async getDataViewsByProfile(key: string, profileName: string){
        const query = {where: `Context.Name=${key} AND Context.Profile.Name="Rep"`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query)
    }
    isGridDataView(dataView: DataView): dataView is GridDataView{
        return dataView.Type == "Grid"
    }
}