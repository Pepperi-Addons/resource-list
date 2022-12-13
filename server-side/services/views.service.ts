import { DataViewsService } from "./dataviews.service"
import { ItemScheme, viewsSchema } from "../metadata"
import { ItemsService } from "./items.service"
import { View } from 'shared'

export class ViewsService extends ItemsService {
    getType(): "view" | "editor" {
        return "view"
    }
    getSchema(): ItemScheme {
        return viewsSchema
    }
    async postDataViews(key: string, repProfileID: number, service: DataViewsService){
        await service.postDefaultDataView(key, repProfileID, this.getType())
        await service.postDefaultMenuDataView(key, repProfileID)
        await service.postDefaultLineMenuDataView(key, repProfileID)
    }
    async getDefaultView(resource: string){
        const views = await this.addonService.papiClient.addons.data.uuid(this.client.AddonUUID).table('views').find()  as View[]
        const viewsOfCurrentResource = views.filter(view => view.Resource?.Name == resource)
        const defaultView =  viewsOfCurrentResource.sort((a,b) => new Date(a.CreationDateTime).getTime() - new Date(b.CreationDateTime).getTime())
        if(defaultView.length > 0){
            return defaultView[0]
        }
        return undefined
    }
}