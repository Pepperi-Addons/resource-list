import { AddonDataScheme, SearchBody } from "@pepperi-addons/papi-sdk";

export class ResourceService{
    async search(resourceName: string, searchBody: SearchBody){
        const result =  await pepperi.resources.resource(resourceName).search(searchBody)
        if(!result || !result.Objects){
            throw new Error(`error while trying to search resource items of resource ${resourceName} with body ${searchBody}`)
        }
        return result
    }
    async getResourceFields(resourceName: string){
        try{
            return await pepperi.resources.resource('resources').key(resourceName).get() as AddonDataScheme
        }catch(err){
            throw Error(`error in resource service - get resource fields ${err}`)
        }
    }
}