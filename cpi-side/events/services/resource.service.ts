import { SearchBody } from "@pepperi-addons/papi-sdk";

export class ResourceService{
    async searchFields(resourceName: string, searchBody: SearchBody){
        const result =  await pepperi.resources.resource(resourceName).search(searchBody)
        if(!result || !result.Objects){
            throw new Error(`error while trying to search resource items of resource ${resourceName} with body ${searchBody}`)
        }
        return result
    }
}