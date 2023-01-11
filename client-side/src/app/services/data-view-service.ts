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
        const dataViewKey = key.replace(/-/g, '')
        const query = {where: `Context.Name=${dataViewKey}`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query)
    }
    async postDataView(dataView: DataView){
        if (dataView.Context) { 
            const name = dataView.Context.Name;
            dataView.Context.Name = name.replace(/-/g, '');
        }
        const result =  await this.utilitiesService.papiClient.metaData.dataViews.upsert(dataView)
        return result as GridDataView
    }
    async getDataViewsByProfile(key: string, profileName: string){
        const dataViewKey = key.replace(/-/g, '')
        const query = {where: `Context.Name=${dataViewKey} AND Context.Profile.Name="Rep"`}
        return await this.utilitiesService.papiClient.metaData.dataViews.find(query)
    }
    isGridDataView(dataView: DataView): dataView is GridDataView{
        return dataView.Type == "Grid"
    }
}