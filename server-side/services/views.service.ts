import { ItemSchema, viewsSchema } from "../metadata"
import { ItemsService } from "./items.service"

export class ViewsService extends ItemsService {
    getType(): "view" | "editor" {
        return "view"
    }
    getSchema(): ItemSchema {
        return viewsSchema
    }
}