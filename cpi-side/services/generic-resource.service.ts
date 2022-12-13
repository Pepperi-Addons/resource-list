
export class GenericResourceService{
    
    async getItems(resourceName: string, query: {where: string}, fields: string[]){
        return await pepperi.resources.resource(resourceName).search({Fields: fields, Where: query.where})
    }
    async postItem(resourceName: string, item: any){
        return await pepperi.resources.resource(resourceName).post(item)
    }

    async getResource(resourceName: string){
        return await pepperi.resources.resource('resources').key(resourceName).get()
    }
}

