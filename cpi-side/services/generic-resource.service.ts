import { AddonDataScheme } from "@pepperi-addons/papi-sdk"
import { GenericResourceEndpoint } from "@pepperi-addons/papi-sdk/dist/endpoints";

export class GenericResourceService {

    constructor(private inAccountContext) { }
    
    async getItems(resourceName: string, query: {where: string}, fields: string[]){
        const apiBaseObj = await this.getBaseObject();
        return await apiBaseObj.resource(resourceName).search({Fields: fields, Where: query.where})
    }
    async postItem(resourceName: string, item: any){
        if(item && item.Hidden && await this.isSchemaOfPapiType(resourceName)){
            throw Error('could not delete item from schema with type papi')
        }
        //if delete get the resource scheme if the type is papi throw an error
        const apiBaseObj = await this.getBaseObject();
        return await apiBaseObj.resource(resourceName).post(item)
    }

    async getResource(resourceName: string){
        const apiBaseObj = await this.getBaseObject();
        return await apiBaseObj.resource('resources').key(resourceName).get()
    }

    async getItemByKey(resourceName: string, itemKey: string) {
        const apiBaseObj = await this.getBaseObject();
        return await apiBaseObj.resource(resourceName).key(itemKey).get();
    }

    private async isSchemaOfPapiType(resourceName: string): Promise<boolean>{
        const schema = await this.getResource(resourceName) as AddonDataScheme
        return schema.Type == "papi"
    }

    private async shouldWorkOnline(): Promise<boolean> {
        const isWebApp = await global['app']['wApp']['isWebApp']();
		const isAdmin = await global['app']['wApp']['isAdmin']();
        return isAdmin && isWebApp && !this.inAccountContext;
    }

    private async getBaseObject() {
        const workOnline = await this.shouldWorkOnline();
        let res: any = pepperi.resources;
        if (workOnline) {
            res = pepperi.papiClient.resources
        }

        return res;
    }
}

