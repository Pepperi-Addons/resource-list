import { GenericResourceService } from "./services/generic-resource-service";

export interface IGenericEditorDataSource{
    update(dataSource: any): Promise<any>
}

export class RegularGEDataSource implements IGenericEditorDataSource{

    constructor(private resourceName: string, private genericResourceService: GenericResourceService){}

    async update(dataSource: any): Promise<any> {
        return await this.genericResourceService.postItem(this.resourceName, dataSource)
    }
    
}
export class ContainedArrayGEDataSource implements IGenericEditorDataSource{

    constructor(private resourceName: string){}

    async update(dataSource: any): Promise<any> {
        debugger
    }
    
}