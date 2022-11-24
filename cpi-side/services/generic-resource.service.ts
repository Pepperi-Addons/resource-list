
export class GenericResourceService{
    
    async  getItems(resourceName: string){
        return await pepperi.papiClient.resources.resource(resourceName).get()
    }
    async postItem(resourceName: string, item: any){
        return await pepperi.papiClient.resources.resource(resourceName).post(item)
    }

    async getResource(resourceName: string){
        return await pepperi.papiClient.resources.resource('resources').key(resourceName).get()
    }
    
}

