import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "./addon.service";
import { DataView, FormDataView, GridDataView } from "@pepperi-addons/papi-sdk";

export class DataViewsService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(private client: Client) {}
    async postDefaultDataView(key: string, profileID: number, type: "view" | "editor"){
        const dataViewKey = key.replace(/-/g, '')
        const defaultDataView = type == "view" ? this.getDefaultGridDataView(dataViewKey,profileID) : this.getDefaultFormDataView(dataViewKey,profileID)
        return await this.postDataView(defaultDataView)
    }
    async postDataView(dataView: DataView){
        return await this.addonService.papiClient.metaData.dataViews.upsert(dataView)
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

}
