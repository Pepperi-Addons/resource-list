import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, GridDataView, GridDataViewField, MenuDataView, PapiClient, SchemeField } from "@pepperi-addons/papi-sdk";
import { IGenericViewer, View } from "shared";
import { DataViewsService } from "./dataviews.service";
import { EditorsService } from "./editors.service";
import { ViewsService } from "./views.service";
import { AddonService } from '../addon.service'
import { toApiQueryString } from '@pepperi-addons/pepperi-filters'
import { TypeMap } from 'shared'
export class GenericViewerService  {
    papiClient: PapiClient
    constructor(private client: Client){
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
     }
    //this method assume that the view always exist
    async getGenericView(viewKey: string): Promise<IGenericViewer>{
        const viewService = new ViewsService(this.client)
        const dataViewService = new DataViewsService(this.client)
        const editorService = new EditorsService(this.client)
        const dataViewKey = viewKey.replace(/-/g, '')
        const [view,[viewDataview], [lineMenuItems], [menuItems], [smartSearch], [search]] = await Promise.all([
            viewService.getItemByKey(viewKey) as Promise<View>,
            dataViewService.getDataView(`GV_${dataViewKey}_View`),
            dataViewService.getDataView(`RV_${dataViewKey}_LineMenu`),
            dataViewService.getDataView(`GV_${dataViewKey}_Menu`),
            dataViewService.getDataView(`GV_${dataViewKey}_SmartSearch`),
            dataViewService.getDataView(`GV_${dataViewKey}_Search`)
        ])
        
        let result: any = {
            view : view,
            viewDataview: viewDataview,
            lineMenuItems: lineMenuItems,
            menuItems: menuItems,
            editor: undefined,
            editorDataView: undefined,
            resourceName: view.Resource.Name,
            filter: toApiQueryString(view.Filter) || '',
            smartSearchDataView: smartSearch,
            searchDataView: search
        }
        if(view.Editor){
            const editorDataViewKey = view.Editor.replace(/-/g, '')
            const [editor, [editorDataView]] = await Promise.all([
                editorService.getItemByKey(view.Editor),
                dataViewService.getDataView(`GV_${editorDataViewKey}_Editor`)

            ])    
            result.editor = editor,
            result.editorDataView = editorDataView
        }
        return result
    }

    async getSelectionList(key: string | undefined, resource: string | undefined): Promise<IGenericViewer>{
        let view: View
        const addonService = new AddonService(this.client)
        const viewsService = new ViewsService(this.client)
        const dataViewService = new DataViewsService(this.client)
        if(!key){
            view = await viewsService.getDefaultView(resource!) as View;
        }else{
            view = await viewsService.getItemByKey(key) as View
        }
        const dataViewKey = view.Key.replace(/-/g, '');
        const [[viewDataView], [smartSearchDataView], [searchDataView] ] = await Promise.all([
            dataViewService.getDataView(`GV_${dataViewKey}_View`),
            dataViewService.getDataView(`GV_${dataViewKey}_SmartSearch`),
            dataViewService.getDataView(`GV_${dataViewKey}_Search`),
        ])
        return {
            view: view,
            viewDataview: viewDataView as GridDataView,
            smartSearchDataView: smartSearchDataView as MenuDataView,
            filter: toApiQueryString(view.Filter) || '',
            searchDataView: searchDataView as MenuDataView,
        }
    }

    async getResourceFieldsWithRefFieldsAsDataViewFields(resourceName: string){
        const fields = await this.getResourceFields(resourceName) || {}
        const typeMap = new TypeMap()
        let currentDataViewFields: any[] = []
        //map resource to the reference fields that has that resource
        Object.keys(fields).forEach(fieldID => {
            const currentField = fields[fieldID]
            if(currentField.Indexed && currentField.Type == "Resource" && currentField.Resource && currentField.IndexedFields){
                //if its reference fields and indexed we want to add all the indexed fields of that reference field
                Object.keys(currentField.IndexedFields).forEach(nestedFieldID => {
                    const nestedField = currentField.IndexedFields![nestedFieldID]
                    if(nestedField.Indexed){
                        const newFieldID = `${fieldID}.${nestedFieldID}`
                        currentDataViewFields.push({
                            FieldID: newFieldID,
                            Mandatory: true,
                            ReadOnly: true,
                            Title: newFieldID,
                            Type: typeMap.get(nestedField.Type)
                        })
                    }
                })
            }
            currentDataViewFields.push({
                FieldID: fieldID,
                Mandatory: true,
                ReadOnly: true,
                Title: fieldID,
                Type: typeMap.get(currentField.Type)
            })
        })
        return currentDataViewFields
    }

    private async getResourceFields(resourceName: string){
        const resource = await this.papiClient.resources.resource('resources').key(resourceName).get() as AddonDataScheme
        return resource?.Fields || {}
    }
    
    async GetResourceSearchFields(resourceName: string): Promise<AddonDataScheme['Fields']> {
        const fields: AddonDataScheme['Fields'] = {
            Key: {
                Type: 'String',
                Unique: true
            }
        }
        const resource = await this.papiClient.resources.resource('resources').key(resourceName).get() as AddonDataScheme
        for (const fieldName of Object.keys(resource.Fields || {})) {
            const field = resource.Fields![fieldName];
            const isSearchable = fieldName != 'Key' && this.ShouldAddToSearch(resource.SyncData, field);
            if(isSearchable) {
                fields[fieldName] = field;
            }
            // if field is reference/object or array of reference/object get their fields
            if (field.Type === 'Resource' || field.Type === 'ContainedResource' || 
            (field.Type === 'Array' && (field.Items?.Type === 'Resource' || field.Items?.Type === 'ContainedResource' ))) {
                const innerResourceName = field.Resource || field.Items?.Resource || '';
                if (innerResourceName === '') {
                    console.error(`Reference field ${fieldName} on resource ${resourceName} has no resource connected to it!`);
                }
                else {
                    try {
                        console.log(`about to get fields for inner scheme ${innerResourceName} referenced by ${fieldName}`);
                        const innerResource = await this.papiClient.resources.resource('resources').key(innerResourceName).get() as AddonDataScheme
                        Object.keys(innerResource.Fields || {}).forEach(innerFieldName => {
                            const innerField = innerResource.Fields![innerFieldName];
                            if(this.ShouldAddToSearch(resource.SyncData, innerField)) {
                                fields[`${fieldName}.${innerFieldName}`] = innerField;
                            }
                        })
                    }
                    catch {
                        console.log(`could not get fields for inner scheme ${innerResourceName} referenced by ${fieldName}`);
                    }
                }
            }
        } 
        return fields;
    }
    
    ShouldAddToSearch(syncData: AddonDataScheme['SyncData'], field: SchemeField) {
        // for now we can only search on String fields. if the resource have 'sync:false' we only search on indexed fields
        return (field.Type === 'String' || field.Type === 'Resource') && (syncData?.Sync || field.Indexed);
    }
} 