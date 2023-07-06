import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { AddonData, AddonDataScheme, FindOptions, GridDataViewField, MenuDataView, MenuDataViewField, SearchData } from "@pepperi-addons/papi-sdk";
import { config } from "../addon.config";
import { GENERIC_RESOURCE_OFFLINE_URL, GENERIC_VIEWS_RESOURCE, API_PAGE_SIZE } from "../metadata";
import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { SmartSearchParser } from "../smart-search-parser/smart-search-parser";
import { UtilitiesService } from "./utilities-service";
import { OldSorting, Sorting } from "shared";


@Injectable({ providedIn: 'root' })
export class GenericResourceOfflineService{
    pluginUUID;
    constructor(
        private addonService: PepAddonService,
        private utilitiesService: UtilitiesService
    ){
    }
    async getResources(): Promise<any[]>{
        return await this.addonService.getAddonCPICall(config.AddonUUID,`${GENERIC_RESOURCE_OFFLINE_URL}/resources`) || []
    }
    
    private getAccountUUIDQuery(resourceFields: AddonDataScheme['Fields'] | undefined, accountUUID: string | undefined){
        if(!accountUUID){
            return ''
        }
        const accountRefFieldID = Object.keys(resourceFields || {}).find(fieldID => {
            const field = resourceFields[fieldID]
            return  (field && field.Type == "Resource" && field.Resource == "accounts") 
        })
        if(!accountRefFieldID){
            return ''
        }
        return `${accountRefFieldID}='${accountUUID}'`

    }

    async getItems(
        resourceName: string,
        getDeletedItems: boolean = false,
        fields: string[],
        filterQuery?: string,
        params?: IPepGenericListParams,
        dataViewFields?: GridDataViewField[],
        resourceFields?: AddonDataScheme['Fields'],
        accountUUID?:string | undefined,
        searchDataView?: MenuDataView,
        sorting?: OldSorting): Promise<SearchData<AddonData>> {
        try{
            const pageSize = (params?.toIndex - params?.fromIndex) + 1 || API_PAGE_SIZE;
            const page = params?.pageIndex || Math.ceil(params?.fromIndex / pageSize) || 1;
            const keyFiledIndex = fields.findIndex(field => field == "Key")
            if(keyFiledIndex < 0){
                fields = [...fields, "Key"]
            }
            
            const accountUUIDQuery = this.getAccountUUIDQuery(resourceFields, accountUUID)
            
            let query: FindOptions = {
                where: this.getWhereClause(filterQuery, params, resourceFields, accountUUID, searchDataView, getDeletedItems), 
                include_deleted: getDeletedItems,
                page: page,
                page_size: pageSize                
            }
            
            return (await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/get_items/${resourceName}`, {query: query, fields: fields, insideAccount: accountUUIDQuery != '', sorting: sorting}))
        }catch(e){
            console.log(`error: ${e}`)
            this.utilitiesService.showDialog('error', 'GeneralErrorMsg', 'close')
            return {
                Objects: [],
                Count: 0
            }
        }
    }
    
    getWhereClause(
        filterQuery?: string,
        params?: IPepGenericListParams,
        resourceFields?: AddonDataScheme['Fields'],
        accountUUID?:string | undefined,
        searchDataView?: MenuDataView,
        getDeletedItems: boolean = false
        ): string {
        let stringQueryArray = [];

        const accountUUIDQuery = this.getAccountUUIDQuery(resourceFields, accountUUID)
        
        if(accountUUIDQuery){
            stringQueryArray.push(`(${accountUUIDQuery})`);
        }

        const smartSearchQuery = this.getSmartSearchStringQuery(resourceFields, params);

        if(smartSearchQuery){
            stringQueryArray.push(`(${smartSearchQuery})`);
        }

        const searchQuery = this.getSearchStringQuery(searchDataView?.Fields || [], params);

        if(searchQuery){
            stringQueryArray.push(`(${searchQuery})`);
        }

        if(filterQuery){
            stringQueryArray.push(`(${filterQuery})`);
        }

        if (getDeletedItems) {
            stringQueryArray.push(`(Hidden=${getDeletedItems})`);
        }

        return stringQueryArray.join(' AND ');
    }
    
    private getSmartSearchStringQuery(resourceFields: AddonDataScheme['Fields'], params?: IPepGenericListParams ){
        if(!params?.filters){
            return ''
        }
        return new SmartSearchParser(params.filters, resourceFields).toString()
    }

    private getSearchStringQuery(dataViewFields: MenuDataViewField[] = [], params?: IPepGenericListParams){
        if(!params?.searchString){
            return ''
        }
        const queryArray = []
        for(const dataViewField of dataViewFields) {
            queryArray.push(`${dataViewField.FieldID} LIKE '%${params.searchString}%'`)
        }
        return `${queryArray.join(' OR ')}`
    }

    async postItem(resourceName, item, accountUUID: string = ''){
        return await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/post_item/${resourceName}`, {item: item, insideAccount: accountUUID != ''})
    }
    async getResource(name: string){
        return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/${name}`) as AddonDataScheme
    }


    async getResourceFields(resourceName: string): Promise<AddonDataScheme['Fields']>{
        const resource = await this.getResource(resourceName)
        return resource?.Fields || {}
    }
    async getGenericView(viewKey: string, accountUUID: string){
        return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/generic_view?Key=${viewKey}&AccountUUID=${accountUUID}`)
    }
    async getSelectionList(viewKey?: string, resource?: string){
        if(viewKey){
            return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/selection_list?Key=${viewKey}`)
        }
        else if(resource){
            return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/selection_list?Resource=${resource}`)
        }
        else{
            return undefined
        }
    }

    async getItemByKey(resourceName: string, itemKey: string) {
        return (await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/get_by_key/${resourceName}/${itemKey}`))
    }
}