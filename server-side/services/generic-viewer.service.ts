import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, GridDataView, GridDataViewField, MenuDataView, PapiClient } from "@pepperi-addons/papi-sdk";
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
        const [view,[viewDataview], [lineMenuItems], [menuItems], [smartSearch]] = await Promise.all([
            viewService.getItemByKey(viewKey) as Promise<View>,
            dataViewService.getDataView(`GV_${dataViewKey}_View`),
            dataViewService.getDataView(`RV_${dataViewKey}_LineMenu`),
            dataViewService.getDataView(`GV_${dataViewKey}_Menu`),
            dataViewService.getDataView(`GV_${dataViewKey}_SmartSearch`)
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
            smartSearchDataView: smartSearch
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
        const [[viewDataView], [smartSearchDataView] ] = await Promise.all([
            dataViewService.getDataView(`GV_${dataViewKey}_View`),
            dataViewService.getDataView(`GV_${dataViewKey}_SmartSearch`)
        ])
        return {
            view: view,
            viewDataview: viewDataView as GridDataView,
            smartSearchDataView: smartSearchDataView as MenuDataView,
            filter: toApiQueryString(view.Filter) || ''
        }
    }

    async getResourceFieldsWithRefFieldsAsDataViewFields(resourceName: string){
        debugger
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


    

} 