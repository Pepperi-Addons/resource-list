import { AddonDataScheme, SchemeField } from "@pepperi-addons/papi-sdk";
import { IGenericViewer } from "../../../shared/entities";
import * as uuid from 'uuid';
import { GenericResourceOfflineService } from "./services/generic-resource-offline.service";

export interface IGenericViewerDataSource{
    genericViewer: IGenericViewer
    type: "contained" | "regular"
    addItem(item: any):Promise<any>
    deleteItem(item:any):Promise<any>
    getItems():Promise<any[]>
    getFields():Promise<AddonDataScheme['Fields']>
    getDeletedItems(): Promise<any[]>
    restore(item: any): Promise<any[]>
    update(item: any): Promise<any>
}

export class ContainedArrayGVDataSource implements IGenericViewerDataSource{
    type: "contained" | "regular" = "contained"
    genericViewer: IGenericViewer
    items: any[] = []
    deletedItems: any[] = []
    fields: AddonDataScheme['Fields'] = {}
    constructor(items?: any[]){
        if(items){
            this.setItems(items)
        }
    }
    async update(item: any){
        const index = this.items.findIndex(listItem => item.Key == listItem.Key)
        if(index < 0){
            this.addItem(item)
            return item
        }
        this.items[index] = item
        return item

    }
    async restore(item: any): Promise<any[]> {
        const index = this.deletedItems.findIndex(listItem => listItem.Key == item.Key)
        if(index < 0){
            return this.deletedItems
        }
        const restoredItem = this.deletedItems[index]
        this.deletedItems.splice(index, 1)
        this.items.push(restoredItem)
        return this.deletedItems
    }
    async addItem(item: any): Promise<any> {
        this.items.push({...item, Key: uuid.v4()})
        return item
    }
    async deleteItem(item: any): Promise<any> {
        const index = this.items.findIndex(listItem => listItem.Key == item.Key)
        this.deletedItems.push(this.items[index])
        this.items.splice(index, 1)
        return item
    }
    async getItems(): Promise<any[]> {
        return this.items
    }
    async getFields(): Promise<AddonDataScheme['Fields']> {
        return this.fields
    }
    setItems(items: any[]){
        this.items = items.map(item => ({...item, Key: uuid.v4()}))
    }
    setFields(fields: AddonDataScheme['Fields'] = {}){
        this.fields = fields
    }
    getUpdatedItems(): any[] {
        const result = this.items?.map(({Key, ...rest}) => rest) || []
        return result
    }
    async getDeletedItems(): Promise<any>{
        return this.deletedItems
    }
}

export class RegularGVDataSource implements IGenericViewerDataSource{
    type: "contained" | "regular" = "regular"
    fields: AddonDataScheme['Fields']
    constructor(
        public genericViewer: IGenericViewer,
        private genericResourceService: GenericResourceOfflineService,
        private items?: any[]
    ){}
    async restore(item: any){
        item.Hidden = false
        await this.addItem(item)
        return await  this.getDeletedItems()
    }
    private async postItem(item: any){
        return await this.genericResourceService.postItem(this.genericViewer.view.Resource.Name, item)
    }
    async getItems(): Promise<any[]>{
        return await this._getItems(false)
    }
    private async _getItems(deleted:boolean){
        return await this.genericResourceService.getItems(this.genericViewer.view.Resource.Name, deleted, this.genericViewer.filter)
    }
    async getFields(){
        if(!this.fields){
            this.fields = (await this.genericResourceService.getResource(this.genericViewer.view.Resource.Name)).Fields || {}
        }
        return this.fields
    }
    setGenericViewer(genericViewer: IGenericViewer){
        this.genericViewer = genericViewer
    }
    async deleteItem(item: any){
        item.Hidden = true
        return await this.postItem(item) as any
    }
    async addItem(item: any){
        return await this.postItem(item) as any
    }
    async getDeletedItems(){
        return await this._getItems(true)
    }
    async update(item: any){
        return await this.postItem(item)
    }
}

export const isRegularGVDataSource = (x: IGenericViewerDataSource): x is RegularGVDataSource => {
    return x.type == "regular"
}
export const isContainedArrayGVDataSource = (x: IGenericViewerDataSource): x is ContainedArrayGVDataSource => {
    return x.type == "contained"
}