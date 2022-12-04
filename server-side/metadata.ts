import { AddonDataScheme } from "@pepperi-addons/papi-sdk"


export const viewsSchema: ItemScheme = {
    SyncData: {
        Sync: true
    },
    Name: "views",
    Type: 'meta_data'
}

export const editorSchema: ItemScheme = {
    SyncData:{
        Sync: true
    },
    Name: "editors",
    Type: 'meta_data',
}
export interface ItemScheme extends AddonDataScheme{
    SyncData: {
        Sync: boolean
    },
    Name: "editors" | "views",
    Type: "meta_data"
}