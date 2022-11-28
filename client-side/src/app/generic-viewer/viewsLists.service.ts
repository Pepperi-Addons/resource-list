import { Injectable } from "@angular/core";
import { AddonDataScheme, SchemeField } from "@pepperi-addons/papi-sdk";
import { IGenericViewer } from "../../../../shared/entities";
import { DataSource } from "../data-source/data-source";
import { IGenericViewerDataSource } from "../generic-viewer-data-source";

@Injectable({
    providedIn: 'root',
})

export class ViewsListsService{
    constructor() {}

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
        const columns = genericViewer.viewDataview.Columns || []
        items = this.reformatListItems(items, await genericViewerDataSource.getFields())
        return new DataSource(items, fields, columns)
    }
}