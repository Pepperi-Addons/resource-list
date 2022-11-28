
export class GenericResourceService{
    
    async getItems(resourceName: string, filterQuery: string, onlyDeletedItems: boolean){
        const query = filterQuery != '' ? `${filterQuery} AND Hidden=${onlyDeletedItems}`: `Hidden=${onlyDeletedItems}`
        return  await pepperi.resources.resource(resourceName).get({where: query})
    }
    async postItem(resourceName: string, item: any){
        return await pepperi.resources.resource(resourceName).post(item)
    }

    async getResource(resourceName: string){
        return await pepperi.resources.resource('resources').key(resourceName).get()
    }

    async getAllResources(){
        return await pepperi.resources.resource('resources').get({})
    }

    
}

