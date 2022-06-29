import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "./addon.service";
import { DataView, FormDataView, GridDataView } from "@pepperi-addons/papi-sdk";

export class DataViewsService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(private client: Client) {}

    // async postDefaultGridDataView(key: string, profileID: number, profileName: string){
    //     const defaultDataView = this.getDefaultGridDataView(key, profileID, profileName)
    //     return await this.postDataView(defaultDataView)
    // }
    async postDefaultDataView(key: string, profileID: number, profileName:string, type: "view" | "editor"){
        const defaultDataView = type == "view" ? this.getDefaultGridDataView(key,profileID,profileName) : this.getDefaultFormDataView(key,profileID,profileName)
        return this.postDataView(defaultDataView)
    }
    async postDataView(dataView: DataView){
        return await this.addonService.papiClient.metaData.dataViews.upsert(dataView)
    }
    // async postDefaultFormDataView(key: string, profileID: number, profileName: string){
    //     const defaultDataView = this.getDefaultFormDataView(key, profileID, profileName)
    //     return await this.postDataView(defaultDataView)
    // }
    getDefaultGridDataView(key: string, profileID: number, profileName: string): GridDataView{
        return {
            Type: "Grid",
            Context: {
                Name: `GV_${key}_View`,
                ScreenSize: "Tablet",
                Profile: {
                    Name: profileName,
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
    getDefaultFormDataView(key: string, profileID: number, profileName: string): FormDataView{
        return {
            Type: "Form",
            Context: {
                Name: `GV_${key}_Editor`,
                ScreenSize: "Tablet",
                Profile: {
                    Name: profileName,
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

}