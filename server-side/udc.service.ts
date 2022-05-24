import { Client } from "@pepperi-addons/debug-server/dist";
import AddonService from "./addon.service";

export class UDCService {  
    addonService: AddonService = new AddonService(this.client);

    constructor(private client: Client) {}

    getAllUDCCollections(): Promise<any>{
        return this.addonService.papiClient.userDefinedCollections.schemes.find()
    }
    getCollectionDataByName(collectionName: string){
        return this.addonService.papiClient.userDefinedCollections.documents(collectionName).find()
    }  

}
