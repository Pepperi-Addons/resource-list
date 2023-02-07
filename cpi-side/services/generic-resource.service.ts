import { AddonDataScheme, SearchBody } from "@pepperi-addons/papi-sdk"

export class GenericResourceService{
    
    async getItems(resourceName: string, query: {where: string}, fields: string[]){
        return await pepperi.resources.resource(resourceName).search({Fields: fields, Where: query.where})
    }
    async postItem(resourceName: string, item: any){
        if(item && item.Hidden && await this.isSchemaOfPapiType(resourceName)){
            throw Error('could not delete item from schema with type papi')
        }
        //if delete get the resource scheme if the type is papi throw an error
        return await pepperi.resources.resource(resourceName).post(item)
    }

    async getResource(resourceName: string){
        return await pepperi.resources.resource('resources').key(resourceName).get()
    }

    async getItemByKey(resourceName: string, itemKey: string) {
        return await pepperi.resources.resource(resourceName).key(itemKey).get();
    }

    private async isSchemaOfPapiType(resourceName: string): Promise<boolean>{
        const schema = await this.getResource(resourceName) as AddonDataScheme
        return schema.Type == "papi"
    }

    async searchItems(resourceName: string, searchBody: SearchBody){
        return await pepperi.resources.resource(resourceName).search(searchBody)
    }
}

