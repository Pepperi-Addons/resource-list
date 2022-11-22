import { Injectable } from "@angular/core";
import { AddonDataScheme, SchemeField } from "@pepperi-addons/papi-sdk";

@Injectable({
    providedIn: 'root',
})

export class ViewsListsService{
    constructor() {}

    reformatListItems(items: any[], resourceFields: AddonDataScheme['Fields']): any[]{
        return items.map(item => this.reformatListItem(item, resourceFields))
    }
    
    reformatListItem(item: any, resourceFields: AddonDataScheme['Fields']){
        Object.keys(item).forEach(fieldID => {
            const field = resourceFields[fieldID]
            item[fieldID] = this.fixItemField(item, field, fieldID)
        })
    }

    fixItemField(item: any, field: SchemeField, fieldID: string){
        if(field.Type == "Array"){
            return this.fixItemArrayField(item, field, fieldID)
        }
        return item
    }
    
    fixItemArrayField(item: any, field: SchemeField, fieldID: string){
        if(field.Type == "Resource" || field.Type == "ContainedResource"){
            return `${item[fieldID].length.toString()} items selected`
        }
        return item[fieldID].join(',')
    }
}