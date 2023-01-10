import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme, GridDataViewField } from "@pepperi-addons/papi-sdk";
import { config } from "../addon.config";
import { GENERIC_RESOURCE_OFFLINE_URL, GENERIC_VIEWS_RESOURCE } from "../metadata";
import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { SmartSearchParser } from "../smart-search-parser/smart-search-parser";
import { UtilitiesService } from "./utilities-service";


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
        return `${accountRefFieldID}=${accountUUID}`

    }
    async getItems(resourceName: string, getDeletedItems: boolean = false, fields: string[], filterQuery?: string, params?: IPepGenericListParams, dataViewFields?: GridDataViewField[], resourceFields?: AddonDataScheme['Fields'], accountUUID?:string | undefined): Promise<any>{
        try{
            const keyFiledIndex = fields.findIndex(field => field == "Key")
            if(keyFiledIndex < 0){
                fields = [...fields, "Key"]
            }
            let stringQueryArray = []
            const accountUUIDQuery = this.getAccountUUIDQuery(resourceFields, accountUUID)
            
            if(accountUUIDQuery){
                stringQueryArray.push(accountUUIDQuery)
            }

            const smartSearchQuery = this.getSmartSearchStringQuery(resourceFields, params)

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
            this.utilitiesService.showDialog('error', 'GeneralErrorMsg', 'close')
            return []
        }
    }
    private getSmartSearchStringQuery(resourceFields: AddonDataScheme['Fields'], params?: IPepGenericListParams ){
        if(!params?.filters){
            return ''
        }
        return new SmartSearchParser(params.filters, resourceFields).toString()
    }

    private getSearchStringQuery(dataViewFields: GridDataViewField[] = [], params?: IPepGenericListParams, resourceFields?: AddonDataScheme['Fields']){
        if(!params?.searchString || !resourceFields){
            return ''
        }
        const queryArray = []
        let alreadyFoundCount = 0
        for(const dataViewField of dataViewFields){
            if(alreadyFoundCount == 2){
                break
            }
            const splittedFieldID = dataViewField.FieldID.split('.')
            const field = resourceFields[splittedFieldID[0]]
            if(dataViewField.FieldID == "Key"){
                queryArray.push(`Key LIKE '${params.searchString}%'`)
            }
            //if the field is a nested field of reference so we want to add the field only if the ref is indexed and the nested field is of type string
            if(splittedFieldID.length == 2 && field && field.Indexed){
                const indexedFields = field.IndexedFields
                if(indexedFields && indexedFields[splittedFieldID[1]]?.Type == "String"){
                    queryArray.push(`${dataViewField.FieldID} LIKE '%${params.searchString}%'`)
                    alreadyFoundCount++
                }
            }
            else if(field?.Indexed && field?.Type == "String"){
                queryArray.push(`${dataViewField.FieldID} LIKE '%${params.searchString}%'`)
                alreadyFoundCount++
            }
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