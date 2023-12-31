import { AddonData, AddonDataScheme, GridDataViewField, SchemeField, SearchData } from "@pepperi-addons/papi-sdk";
import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { IGenericViewer } from "shared";
import * as uuid from 'uuid';
import { GenericResourceOfflineService } from "./services/generic-resource-offline.service";
import { IDataViewField } from "./metadata";

export interface IGenericViewerDataSource{
    genericViewer: IGenericViewer
    type: "contained" | "regular"
    addItem(item: any):Promise<any>
    deleteItem(item:any):Promise<any>
    getItems(params?: IPepGenericListParams, fields?: GridDataViewField[], resourceFields?: AddonDataScheme['Fields'], accountUUID?: string | undefined):Promise<SearchData<AddonData>>
    getFields():Promise<AddonDataScheme['Fields']>
    getDeletedItems(): Promise<SearchData<AddonData>>
    restore(item: any): Promise<SearchData<AddonData>>
    update(item: any): Promise<any>
    getEditorItemByKey(key: string)
    isInlineList()
    getwhereClause(params?: IPepGenericListParams, resourceFields?:AddonDataScheme['Fields'], accountUUID?:string | undefined, isRecycleBin?: boolean): string
    setFields(fields: AddonDataScheme['Fields']);
}

export class ContainedArrayGVDataSource implements IGenericViewerDataSource{
    type: "contained" | "regular" = "contained"
    items: any[] = []
    deletedItems: any[] = []
    fields: AddonDataScheme['Fields'] = {}
    constructor(public genericViewer: IGenericViewer, private genericResourceService: GenericResourceOfflineService, items?: any[]){
        if(Array.isArray(items)){
            this.setItems(items)
        }
    }
    async getEditorItemByKey(key: string) {
        const item = this.items.find(item => item.Key == key)
        return JSON.parse(JSON.stringify(item))
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
    
    async restore(item: any): Promise<SearchData<AddonData>> {
        const index = this.deletedItems.findIndex(listItem => listItem.Key == item.Key)
        if(index < 0){
            return {
                Objects: this.deletedItems
            }
        }
        const restoredItem = this.deletedItems[index]
        this.deletedItems.splice(index, 1)
        this.items.push(restoredItem)
        return {
            Objects: this.deletedItems
        }
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
    async getItems(): Promise<SearchData<AddonData>> {
        return {
            Objects: this.items || []
        }
    }
    async getFields(): Promise<AddonDataScheme['Fields']> {
        if(Object.keys(this.fields || {}).length === 0){
            this.fields = (await this.genericResourceService.getResource(this.genericViewer.view.Resource.Name)).Fields || {}
        }
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
    isInlineList() {
        return true;
    }

    getwhereClause(params?: IPepGenericListParams, resourceFields?: { [key: string]: SchemeField; }, accountUUID?: string, isRecycleBin?: boolean): string {
        return '';
    }
}

export class RegularGVDataSource implements IGenericViewerDataSource{
    type: "contained" | "regular" = "regular"
    fields: AddonDataScheme['Fields']
    fieldsIDs: string[]
    constructor(
        public genericViewer: IGenericViewer,
        private genericResourceService: GenericResourceOfflineService,
        private items?: any[],
        private accountUUID: string = ''
    ){
        this.fieldsIDs = (this.genericViewer.viewDataview.Fields || []).map(gridDataViewField => gridDataViewField.FieldID)
    }
    
    async getEditorItemByKey(key: string){
        const fieldIDsArray = (this.genericViewer.editorDataView?.Fields || []).map(field => field.FieldID)
        const query = `Key='${key}'`
        const result = (await this.genericResourceService.getItems(this.genericViewer.editor?.Resource?.Name, false, fieldIDsArray, query)).Objects
        return result.length > 0? result[0] : {}
      }

    async restore(item: any){
        item.Hidden = false
        await this.addItem(item)
        return await  this.getDeletedItems()
    }
    private async postItem(item: any){
        return await this.genericResourceService.postItem(this.genericViewer.view.Resource.Name, item, this.accountUUID)
    }
    
    getwhereClause(params?: IPepGenericListParams, resourceFields?:AddonDataScheme['Fields'], accountUUID?:string | undefined, isRecycleBin: boolean = false): string{
        return this.genericResourceService.getWhereClause(this.genericViewer.filter, params, resourceFields, accountUUID, this.genericViewer.searchDataView, isRecycleBin)
    }

    async getItems(params?: IPepGenericListParams, fields?:GridDataViewField[], resourceFields?:AddonDataScheme['Fields'], accountUUID?:string | undefined): Promise<SearchData<AddonData>>{
        return await this._getItems(false, params, fields, resourceFields, accountUUID)
    }
    private async _getItems(deleted:boolean, params?: IPepGenericListParams, fields? : GridDataViewField[], resourceFields?: AddonDataScheme['Fields'], accountUUID?:string | undefined): Promise<SearchData<AddonData>> {
        return await this.genericResourceService.getItems(this.genericViewer.view.Resource.Name, deleted,  this.fieldsIDs, this.genericViewer.filter, params, fields, resourceFields, accountUUID, this.genericViewer.searchDataView, this.genericViewer.view.Sorting)
    }
    async getFields(){
        if(Object.keys(this.fields || {}).length === 0){
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
    setFields(fields: AddonDataScheme['Fields'] = {}){
        this.fields = fields
    }
    isInlineList() {
        return false;
    }
}

export const isRegularGVDataSource = (x: IGenericViewerDataSource): x is RegularGVDataSource => {
    return x.type == "regular"
}
export const isContainedArrayGVDataSource = (x: IGenericViewerDataSource): x is ContainedArrayGVDataSource => {
    return x.type == "contained"
}