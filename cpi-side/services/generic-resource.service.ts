
export class GenericResourceService{
    
    async getItems(resourceName: string, query: {where: string, include_deleted?: boolean}){
        return  await pepperi.resources.resource(resourceName).get(query)
    }
    async postItem(resourceName: string, item: any){
        return await pepperi.resources.resource(resourceName).post(item)
    }

    async getResource(resourceName: string){
        return await pepperi.resources.resource('resources').key(resourceName).get()
    }
}

