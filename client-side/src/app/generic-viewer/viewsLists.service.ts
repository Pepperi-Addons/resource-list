import { Injectable } from "@angular/core";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme, SchemeField } from "@pepperi-addons/papi-sdk";
import { IGenericViewer } from "shared";
import { DataSource } from "../data-source/data-source";
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

    async createListDataSource(genericViewerDataSource: IGenericViewerDataSource, genericViewer: IGenericViewer): Promise<DataSource>{
        let items = await genericViewerDataSource.getItems()
        const fields =  genericViewer.viewDataview.Fields || []
        if(genericViewer.view.isFirstFieldDrillDown && fields.length > 0){
            fields[0].Type = "Link"
        }
        const columns = genericViewer.viewDataview.Columns || []
        items = this.reformatListItems(items, await genericViewerDataSource.getFields())
        return new DataSource(items, fields, columns)
    }

    async emitDrillDownEvent(itemKey: string, viewKey: string, resourceName:string){
        await this.addonService.emitEvent(DRILL_DOWN_EVENT_KEY, {ObjectKey: itemKey, ViewKey: viewKey, ResourceKey: resourceName})
    }
}