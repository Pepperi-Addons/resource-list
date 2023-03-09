import { AddonDataScheme, SearchBody } from "@pepperi-addons/papi-sdk"
import { GenericResourceEndpoint } from "@pepperi-addons/papi-sdk/dist/endpoints";
import { Sorting } from "shared";
import { UtilitiesService } from "./utilities.service";

export class GenericResourceService {
    utilities: UtilitiesService = new UtilitiesService();

    constructor(private inAccountContext) { }
    
    async getItems(resourceName: string, query: {where: string}, fields: string[], sorting?: Sorting){
        const apiBaseObj = await this.getBaseObject();
        const sortingStr = this.utilities.getSortingString(sorting);
        const body: SearchBody = {
            Fields: fields,
            Where: query.where
        }
        if (sortingStr != '') {
            body.OrderBy = sortingStr;
        }
        return await apiBaseObj.resource(resourceName).search(body)
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
		const isBuyer = await global['app']['wApp']['isBuyer']();
        return !isBuyer && isWebApp && !this.inAccountContext;
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

