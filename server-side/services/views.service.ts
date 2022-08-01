import { DataViewsService } from "../dataviews.service"
import { ItemSchema, viewsSchema } from "../metadata"
import { ItemsService } from "./items.service"

export class ViewsService extends ItemsService {
    getType(): "view" | "editor" {
        return "view"
    }
    getSchema(): ItemSchema {
        return viewsSchema
    }
    async postDataViews(key: string, repProfileID: number, service: DataViewsService){
        await service.postDefaultDataView(key, repProfileID, this.getType())
        await service.postDefaultMenuDataView(key, repProfileID)
    }
}