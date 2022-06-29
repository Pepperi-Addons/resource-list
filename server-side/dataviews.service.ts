import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "./addon.service";
import { editorsTable, viewsTable } from "./metadata";
import { v4 as uuidv4 } from 'uuid';
import { FindOptions, GridDataView } from "@pepperi-addons/papi-sdk";
import { Fields } from "@pepperi-addons/papi-sdk/dist/endpoints";

export class DataViewsService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(private client: Client) {}

    async postDefaultDataView(key: string, profileID: number, profileName: string){
        const defaultDataView = this.getDefaultDataView(key, profileID, profileName)
        return await this.postDataView(defaultDataView)
    }
    async postDataView(dataView: GridDataView): Promise<GridDataView>{
        return (await this.addonService.papiClient.metaData.dataViews.upsert(dataView)) as GridDataView
    }
    getDefaultDataView(key: string, profileID: number, profileName: string): GridDataView{
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

}
