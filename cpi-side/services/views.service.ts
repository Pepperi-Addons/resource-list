
import { DataViewContext, GridDataView } from "@pepperi-addons/papi-sdk";
import { AddonUUID } from "../../addon.config.json";
import { View, Editor} from '../../shared/entities'
import { toApiQueryString } from '@pepperi-addons/pepperi-filters'

export class ViewsService{

    async getGenericView(viewKey: string){
        const dataViewKey = this.getDataViewKeyFromUUID(viewKey)
        const [view,viewDataview, lineMenuItems, menuItems] = await Promise.all([
            this.getView(viewKey) as Promise<View>,
            this.getDataView(`GV_${dataViewKey}_View`),
            this.getDataView(`RV_${dataViewKey}_LineMenu`),
            this.getDataView(`GV_${dataViewKey}_Menu`)
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
            const editorDataViewKey = this.getDataViewKeyFromUUID(view.Editor)
            const [editor, editorDataView] = await Promise.all([
                this.getEditor(view.Editor),
                this.getDataView(`GV_${editorDataViewKey}_Editor`)

            ])    
            result.editor = editor,
            result.editorDataView = editorDataView
        }
        return result
    }
    async getSelectionList(viewKey: string | undefined, resourceKey: string | undefined){
        let view: View
        if(!viewKey){
            view = await this.getDefaultView(resourceKey!) as View;
        }else{
            view = await this.getView(viewKey) as View
        }
        const dataViewKey = this.getDataViewKeyFromUUID(view.Key)
        const dataview = await this.getDataView(`GV_${dataViewKey}_View`) as GridDataView
        return {
            view: view,
            viewDataview: dataview,
            filter: toApiQueryString(view.Filter) || ''
        }
    }
    private async getDefaultView(resourceKey: string){
        const views = await this.getViews()
        const viewsOfCurrentResource = views.filter(view => view.Resource?.Name == resourceKey)
        const sortedViewsByCreationDataTime =  viewsOfCurrentResource.sort((a,b) => new Date(a.CreationDateTime).getTime() - new Date(b.CreationDateTime).getTime())
        if(sortedViewsByCreationDataTime.length > 0){
            return sortedViewsByCreationDataTime[0]
        }
        return undefined
    }
    private async getViews(): Promise<View[]>{
        return await (await pepperi.addons.data.uuid(AddonUUID).table('views').search({})).Objects as  View[]
    }
    private async getView(viewKey: string): Promise<View>{
        return await pepperi.addons.data.uuid(AddonUUID).table('views').key(viewKey).get()
    }
    private async getDataView(dataviewKey: string){
        const ctx = {Name: dataviewKey, Profile: { Name: 'Rep'}} as DataViewContext
        const dvObject = await pepperi.UIObject.Create(ctx)
        return dvObject!.dataView
    }
    private async getEditor(editorKey: string){
        return (await pepperi.addons.data.uuid(AddonUUID).table('editors').search({Where: `Key=${editorKey}`}))
    }
    private getDataViewKeyFromUUID(uuid: string){
        return uuid.replace(/-/g, '')
    }
}