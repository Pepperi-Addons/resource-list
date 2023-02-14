import { SearchBody } from "@pepperi-addons/papi-sdk";

export class ResourceService{
    async searchFields(resourceName: string, searchBody: SearchBody){
        return await pepperi.resources.resource(resourceName).search(searchBody)
    }
}