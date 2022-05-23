import { Client } from "@pepperi-addons/debug-server/dist";
import AddonsService from "./addons.service";

export class UDCService {  
    addonsService: AddonsService = new AddonsService(this.client);

    constructor(private client: Client) {}

    getAllUDCCollections(): Promise<any>{
        return this.addonsService.papiClient.userDefinedCollections.schemes.find()
    }
    getCollectionDataByName(collectionName: string){
        return this.addonsService.papiClient.userDefinedCollections.documents(collectionName).find()
    }  

}
