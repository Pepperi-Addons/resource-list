import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme, GridDataViewField } from "@pepperi-addons/papi-sdk";
import { config } from "../addon.config";
import { GENERIC_RESOURCE_OFFLINE_URL, GENERIC_VIEWS_RESOURCE, IDataViewField } from "../metadata";
import { UtilitiesService } from "./utilities-service";
import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { SmartSearchParser } from "../smart-search-parser/smart-search-parser";


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
    async getItems(resourceName: string, getDeletedItems: boolean = false, fields: string[], filterQuery?: string, params?: IPepGenericListParams, dataViewFields?: GridDataViewField[], resourceFields?: AddonDataScheme['Fields']): Promise<any>{
        try{
            const keyFiledIndex = fields.findIndex(field => field == "Key")
            if(keyFiledIndex < 0){
                fields = [...fields, "Key"]
            }
            let stringQueryArray = []
            const smartSearchQuery = this.getSmartSearchStringQuery(dataViewFields, params)

            if(smartSearchQuery){
                stringQueryArray.push(`(${smartSearchQuery})`)
            }

            const searchQuery = this.getSearchStringQuery(dataViewFields, params, resourceFields)

            if(searchQuery){
                stringQueryArray.push(`(${searchQuery})`)

            }

            if(filterQuery){
                stringQueryArray.push(`(${filterQuery})`)
            }

            stringQueryArray.push(`(Hidden=${getDeletedItems})`)
            let query = {where: stringQueryArray.join(' AND '), include_deleted: getDeletedItems}

           return (await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/get_items/${resourceName}`, {query: query, fields: fields})).Objects || []
        }catch(e){
            console.log(`error: ${e}`)
            return []
        }
    }
    private getSmartSearchStringQuery(dataViewFields: GridDataViewField[], params?: IPepGenericListParams ){
        if(!params?.filters){
            return ''
        }
        return new SmartSearchParser(params.filters, dataViewFields).toString()
    }

    private getStringIndexedFieldsSet(resourceFields?: AddonDataScheme['Fields']): Set<string>{
        const set: Set<string> = new Set<string>()
        Object.keys(resourceFields || {}).forEach(fieldID => {
            const field = resourceFields[fieldID]
            if(field.Indexed && field.Type == "String"){
                set.add(fieldID)
            }
            else if(field.Indexed && field.Type == "Resource"){
                const indexedFieldsOfReference = field.IndexedFields || {}
                Object.keys(indexedFieldsOfReference).forEach(indexedFieldID =>{
                    const indexedFieldOfRef = indexedFieldsOfReference[indexedFieldID]
                    if(indexedFieldOfRef.Type == "String" && indexedFieldOfRef.Indexed){
                        set.add(`${field.Resource}.${indexedFieldID}`)
                    }
                })
            }
        })
        return set
    }
    private getSearchStringQuery(dataViewFields: GridDataViewField[] = [], params?: IPepGenericListParams, resourceFields?: AddonDataScheme['Fields']){
        if(!params?.searchString || !resourceFields){
            return ''
        }
        // const indexedFieldsSet = this.getStringIndexedFieldsSet(resourceFields)
        const firstTwoIndexed = []
        for(const dataViewField of dataViewFields){
            if(firstTwoIndexed.length == 2){
                break
            }
            const splittedFieldID = dataViewField.FieldID.split('.')
            //there are two cases we want to add the field 
            //1. if it contains a dot then it is field of reference field and we know that the field is indexed 
            //2. if its regular field then we need to make sure that the field is indexed
            if(splittedFieldID.length == 2 || (resourceFields[dataViewField.FieldID] && resourceFields[dataViewField.FieldID].Indexed)){
                firstTwoIndexed.push(dataViewField.FieldID)
            }
            // if(indexedFieldsSet.has(dataViewField.FieldID)){
            //     firstTwoIndexed.push(dataViewField.FieldID)
            // }
        }
        const queryArray = firstTwoIndexed.map(field => `${field} LIKE '%${params.searchString}%'`)
        if(dataViewFields.find(dataViewField => dataViewField.FieldID == "Key")){
            queryArray.push(`Key LIKE '${params.searchString}%'`)
        }
        return `${queryArray.join(' OR ')}`



    }
    async postItem(resourceName, item){
        return await this.addonService.postAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/post_item/${resourceName}`, item)
    }
    async getResource(name: string){
        return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_RESOURCE_OFFLINE_URL}/${name}`) as AddonDataScheme
    }


    async getResourceFields(resourceName: string): Promise<AddonDataScheme['Fields']>{
        const resource = await this.getResource(resourceName)
        return resource?.Fields || {}
    }
    async getGenericView(viewKey: string){
        return await this.addonService.getAddonCPICall(config.AddonUUID, `${GENERIC_VIEWS_RESOURCE}/generic_view?Key=${viewKey}`)
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
}