import { editorSchema, ItemSchema } from "../metadata"
import { ItemsService } from "./items.service"

export class EditorsService extends ItemsService {
    getType(): "view" | "editor" {
        return "editor"
    }
    getSchema(): ItemSchema {
        return editorSchema
    }
} 