import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, GridDataView, GridDataViewField, PapiClient } from "@pepperi-addons/papi-sdk";
import { IGenericViewer, View } from "../../shared/entities";
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
        const [view,[viewDataview], [lineMenuItems], [menuItems]] = await Promise.all([
            viewService.getItemByKey(viewKey) as Promise<View>,
            dataViewService.getDataView(`GV_${dataViewKey}_View`),
            dataViewService.getDataView(`RV_${dataViewKey}_LineMenu`),
            dataViewService.getDataView(`GV_${dataViewKey}_Menu`)
        ])
        
        let result: any = {
            view : view,
            viewDataview: viewDataview,
            lineMenuItems: lineMenuItems,
            menuItems: menuItems,
            editor: undefined,
            editorDataView: undefined,
            resourceName: view.Resource.Name,
            filter: toApiQueryString(view.Filter) || ''
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
        const [dataview] = await dataViewService.getDataView(`GV_${dataViewKey}_View`) as GridDataView[]
        return {
            view: view,
            viewDataview: dataview,
            filter: toApiQueryString(view.Filter) || ''
        }
    }

    async getResourceFieldsWithRefFieldsAsDataViewFields(resourceName: string){
        const fields = await this.getResourceFields(resourceName) || {}
        const resourcesSet: Set<string> = new Set()
        const typeMap = new TypeMap()
        const currentDataViewFields: any[] = []
        Object.keys(fields).forEach(fieldID => {
            const currentField = fields[fieldID]
            if(currentField.Type == "Resource" && currentField.Resource && !resourcesSet.has(currentField.Resource)){
                resourcesSet.add(currentField.Resource)
            }
            currentDataViewFields.push({
                FieldID: fieldID,
                Mandatory: true,
                ReadOnly: true,
                Title: fieldID,
                Type: typeMap.get(currentField.Type)
            })
        })
        const resourcesNameAndFieldsArray = await this.getResourcesFieldsAndNamesFromSet(resourcesSet)
       return [...currentDataViewFields ,...await this.flatResourcesFieldWithNamePrefix(resourcesNameAndFieldsArray)]
    }
    private async getResourcesFieldsAndNamesFromSet(set: Set<string>){
       return await Promise.all(Array.from(set, resource => this.getResourceNameAndFields(resource)))
    }
    private async getResourceFields(resourceName: string){
        const resource = await this.papiClient.resources.resource('resources').key(resourceName).get() as AddonDataScheme
        return resource?.Fields || {}
    }

    private flatResourcesFieldWithNamePrefix(fieldsAndResourcesNamesArray: {name: string, fields: AddonDataScheme['Fields']}[]): GridDataViewField[]{
        /**
         * 1. we first map over every resource and create array of its fields
         *  where the fieldID will be resourceName.fileID and create an array of arrays 
         * 2. then we use the reduce to flat the array
         */
        return fieldsAndResourcesNamesArray.map(resource => {
            return this.getDataViewFieldsWithNamePrefix(resource.name, resource.fields!!)
        }).reduce((acc, val) => acc.concat(val), [])
    }
    private getDataViewFieldsWithNamePrefix(prefix, fields): GridDataViewField[]{
        const typeMap = new TypeMap()
        return Object.keys(fields).map(fieldID => {
            const field = fields[fieldID]
            const newFieldID = prefix + '.' + fieldID
            return {
                FieldID: newFieldID,
                Mandatory: true,
                ReadOnly: true,
                Title: newFieldID,
                Type: typeMap.get(field.Type)
            }
        })
    }
    

    private async getResourceNameAndFields(resourceName: string){
        const fields = await this.getResourceFields(resourceName)
        return {
            name: resourceName,
            fields: fields
        }
    }
} 