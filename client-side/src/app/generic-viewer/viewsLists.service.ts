import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme, MenuDataView, SchemeField, SchemeFieldType, SchemeFieldTypes } from "@pepperi-addons/papi-sdk";
import { IGenericViewer } from "shared";
import { DataSource, DynamicItemsDataSource } from "../data-source/data-source";
import { IGenericViewerDataSource } from "../generic-viewer-data-source";
import { DRILL_DOWN_EVENT_KEY } from "../metadata";

@Injectable({
    providedIn: 'root',
})

export class ViewsListsService{
    constructor(
        private addonService: PepAddonService
    ) {}

    reformatListItems(items: any[], resourceFields: AddonDataScheme['Fields']): any[]{
        return items.map(item => this.reformatListItem(item, resourceFields))
    }
    
    private reformatListItem(item: any, resourceFields: AddonDataScheme['Fields']){
        const newItem = {}
        Object.keys(item).forEach(fieldID => {
            const field = resourceFields[fieldID]
            newItem[fieldID] = field?.Type == 'Array' ? this.arrayToViewString(item[fieldID], field.Type) : item[fieldID]
        })
        return newItem
    }
    arrayToViewString(value: any[], type: SchemeField['Type']): string{
        if(type == "Resource" || type == "ContainedResource"){
            return `${value.length.toString()} items selected`
        }
        return value.join(',')
    }

    async createListDataSource(genericViewerDataSource: IGenericViewerDataSource, genericViewer: IGenericViewer, resourceFields: AddonDataScheme['Fields']): Promise<DataSource>{
        // let items = await genericViewerDataSource.getItems()
        const fields =  genericViewer.viewDataview.Fields || []
        if(genericViewer.view.isFirstFieldDrillDown && fields.length > 0){
            fields[0].Type = "Link"
        }
        const columns = genericViewer.viewDataview.Columns || []
        // items = this.reformatListItems(items, await genericViewerDataSource.getFields())
        return new DataSource(new DynamicItemsDataSource(async (params) => {
            const items = await genericViewerDataSource.getItems(params, fields, resourceFields, undefined)
            const formattedItems = this.reformatListItems(items, resourceFields)
            return {
                items: formattedItems,
                totalCount: items.length
            }


        }), fields, columns)
    }

    async emitDrillDownEvent(itemKey: string, viewKey: string, resourceName:string){
        await this.addonService.emitEvent(DRILL_DOWN_EVENT_KEY, {ObjectKey: itemKey, ViewKey: viewKey, ResourceKey: resourceName})
    }

    getSmartSearchConfiguration(smartSearchDataView: MenuDataView, resourceFields: AddonDataScheme['Fields']){
        this.addTypesToSmartSearchDataView(smartSearchDataView, resourceFields)
        return {
            dataView: smartSearchDataView
        }
    }
    private addTypesToSmartSearchDataView(smartSearchDataView: MenuDataView,resourceFields: AddonDataScheme['Fields'] ){
        (smartSearchDataView?.Fields || [] ).forEach(field => {
            let type = resourceFields[field.FieldID]?.Type;
            // if the field does not exist on the resource fields, check if he is part of resource's indexed fields and take the type from there
            if(!type && field.FieldID.indexOf('.') > 0) {
                const parts = field.FieldID.split('.');
                if(resourceFields[parts[0]] && resourceFields[parts[0]].IndexedFields) {
                    type = resourceFields[parts[0]].IndexedFields[parts[1]]?.Type;
                }
            }
            field['Type'] = this.convertFieldTypeToSmartSearchType(type)
        })
    }  
    
    private convertFieldTypeToSmartSearchType(fieldType: SchemeFieldType): SchemeFieldType {
        let res: SchemeFieldType = 'String';

        switch (fieldType) {
            case 'ContainedResource':
            case 'Resource': {
                res = 'String';
                break;
            }
            default: {
                res = fieldType;
            }
        }
        return res;
    }
}