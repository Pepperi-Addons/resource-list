import { BaseFormDataView, GridDataView, MenuDataView } from "@pepperi-addons/papi-sdk"
import { Editor, View } from "../shared/entities"


export const viewsSchema: ItemSchema = {
    Name: "views",
    Type: 'meta_data',
}
export const editorSchema: ItemSchema = {
    Name: "editors",
    Type: 'meta_data',
}

export type ItemSchema = {
    Name: string,
    Type: "meta_data"
}