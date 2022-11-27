
export class GenericResourceService{
    
    async getItems(resourceName: string, filterQuery: string, onlyDeletedItems: boolean){
        // const query = this.chainHiddenToFilterQuery(onlyDeletedItems, filterQuery)
        const where = {where: 'Hidden=true'}
        return await pepperi.resources.resource(resourceName).get(where)
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
    chainHiddenToFilterQuery(hidden: boolean, filterQuery){
        const hiddenString = `Hidden=true`
        return hiddenString
        // return hiddenString + `AND ${filterQuery}`
    }
    
}

