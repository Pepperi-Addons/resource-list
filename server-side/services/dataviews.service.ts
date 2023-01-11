import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "../addon.service";
import { DataView, FormDataView, GridDataView, MenuDataView } from "@pepperi-addons/papi-sdk";
import { Fields } from "@pepperi-addons/papi-sdk/dist/endpoints";

export class DataViewsService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(private client: Client) {}
    async postDefaultDataView(key: string, profileID: number, type: "view" | "editor"){
        const dataViewKey = key.replace(/-/g, '')
        const defaultDataView = type == "view" ? this.getDefaultGridDataView(dataViewKey,profileID) : this.getDefaultFormDataView(dataViewKey,profileID)
        return await this.addonService.papiClient.metaData.dataViews.upsert(defaultDataView)
    }
    async postDefaultSmartSearchDataView(key: string, profileID: number){
        const smartSearchDataView: MenuDataView = {
            Type: "Menu",
            Context: {
                Name: `GV_${key}_SmartSearch`,
                Profile: {
                    InternalID : profileID,
                    Name: "Rep"
                },
                ScreenSize: "Landscape",
            },
            Fields: []
        }
        return await this.addonService.papiClient.metaData.dataViews.upsert(smartSearchDataView)
    }

    async postDefaultSearchDataView(key: string, profileID: number){
        const searchDataView: MenuDataView = {
            Type: "Menu",
            Context: {
                Name: `GV_${key}_Search`,
                Profile: {
                    InternalID : profileID,
                    Name: "Rep"
                },
                ScreenSize: "Landscape",
            },
            Fields: []
        }
        return await this.addonService.papiClient.metaData.dataViews.upsert(searchDataView)
    }
    async postDefaultLineMenuDataView(key: string, profileID: number){
        const menuDataView: MenuDataView = {
            Type: "Menu",
            Context: {
                Name: `RV_${key}_LineMenu`,
                Profile: {
                    InternalID : profileID,
                    Name: "Rep"
                },
                ScreenSize: "Landscape",
            },
            Fields: [
                {
                    FieldID: "Edit",
                    Title: "Edit",
                },
                {
                    FieldID: "Delete",
                    Title: "Delete",
                },
            ]
        }
        return await this.addonService.papiClient.metaData.dataViews.upsert(menuDataView)
    }
    async postDefaultMenuDataView(key: string, profileID: number){
        const menuDataView: MenuDataView = {
            Type: "Menu",
            Context: {
                Name: `GV_${key}_Menu`,
                Profile: {
                    InternalID : profileID,
                    Name: "Rep"
                },
                ScreenSize: "Landscape",
            },
            Fields: [
                {
                    FieldID: "New",
                    Title: "New",
                },
                {
                    FieldID: "Export",
                    Title: "Export",
                },
                {
                    FieldID: "Import",
                    Title: "Import",
                },
                {
                    FieldID: "RecycleBin",
                    Title: "Recycle Bin",
                }
            ]
        }
        return await this.addonService.papiClient.metaData.dataViews.upsert(menuDataView)
    }
    getDefaultGridDataView(key: string, profileID: number): GridDataView{
        return {
            Type: "Grid",
            Context: {
                Name: `GV_${key}_View`,
                ScreenSize: "Tablet",
                Profile: {
                    InternalID: profileID
                }
            },
            Fields: [
                {
                    FieldID: "Key",
                    Type: "TextBox",
                    Title: "Key",
                    Mandatory: true,
                    ReadOnly: true,
                    Layout: {
                        Origin: {
                            X: 0,
                            Y: 0
                        }
                    },
                    Style: {
                        Alignment: {
                            Vertical: "Center",
                            Horizontal: "Stretch"
                        }
                    }
                },
                {
                    FieldID: "CreationDateTime",
                    Type: "DateAndTime",
                    Title: "Creation Date Time",
                    Mandatory: true,
                    ReadOnly: true,
                    Layout: {
                        Origin: {
                            X: 1,
                            Y: 0
                        }
                    },
                    Style: {
                        Alignment: {
                            Vertical: "Center",
                            Horizontal: "Stretch"
                        }
                    }
                },
                {
                    FieldID: "ModificationDateTime",
                    Type: "DateAndTime",
                    Title: "Modification Date Time",
                    Mandatory: true,
                    ReadOnly: true,
                    Layout: {
                        Origin: {
                            X: 2,
                            Y: 0
                        }
                    },
                    Style: {
                        Alignment: {
                            Vertical: "Center",
                            Horizontal: "Stretch"
                        }
                    }
                }
            ],
            Columns: [
                {
                    Width: 10
                },
                {
                    Width: 10
                },
                {
                    Width: 10
                }
            ]
        }
    }
    getDefaultFormDataView(key: string, profileID: number): FormDataView{
        return {
            Type: "Form",
            Context: {
                Name: `GV_${key}_Editor`,
                ScreenSize: "Tablet",
                Profile: {
                    InternalID: profileID
                }
            },
            Fields: [
                {
                    FieldID: "Key",
                    Type: "TextBox",
                    Title: "Key",
                    Mandatory: true,
                    ReadOnly: true,
                    Layout: {
                        Origin: {
                            X: 0,
                            Y: 0
                        },
                        Size: {
                            Height: 1,
                            Width: 1
                        }
                    },
                    Style: {
                        Alignment: {
                            Vertical: "Center",
                            Horizontal: "Stretch"
                        }
                    }
                },
                {
                    FieldID: "CreationDateTime",
                    Type: "DateAndTime",
                    Title: "Creation Date Time",
                    Mandatory: true,
                    ReadOnly: true,
                    Layout: {
                        Origin: {
                            X: 0,
                            Y: 1
                        },
                        Size: {
                            Height: 1,
                            Width: 1
                        }
                    },
                    Style: {
                        Alignment: {
                            Vertical: "Center",
                            Horizontal: "Stretch"
                        }
                    }
                    
                },
                {
                    FieldID: "ModificationDateTime",
                    Type: "DateAndTime",
                    Title: "Modification Date Time",
                    Mandatory: true,
                    ReadOnly: true,
                    Layout: {
                        Origin: {
                            X: 0,
                            Y: 2
                        },
                        Size: {
                            Height: 1,
                            Width: 1
                        }
                    },
                    Style: {
                        Alignment: {
                            Vertical: "Center",
                            Horizontal: "Stretch"
                        }
                    }
                }
            ]
        }
    }
    async getDataView(key: string){
        const query = {where: `Context.Name=${key}`}
        return await this.addonService.papiClient.metaData.dataViews.find(query) 
    }

}
