
import { DataViewContext, GridDataView, MenuDataView } from "@pepperi-addons/papi-sdk";
import { AddonUUID } from "../../addon.config.json";
import { View, Editor} from 'shared'
import { toApiQueryString } from '@pepperi-addons/pepperi-filters'

export class ViewsService{

    async getGenericView(viewKey: string){
        const dataViewKey = this.getDataViewKeyFromUUID(viewKey)
        const [view,viewDataview, lineMenuItems, menuItems, smartSearchDataView, searchDataView] = await Promise.all([
            this.getView(viewKey) as Promise<View>,
            this.getDataView(`GV_${dataViewKey}_View`),
            this.getDataView(`RV_${dataViewKey}_LineMenu`),
            this.getDataView(`GV_${dataViewKey}_Menu`),
            this.getDataView(`GV_${dataViewKey}_SmartSearch`),
            this.getDataView(`GV_${dataViewKey}_Search`)
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
            smartSearchDataView: smartSearchDataView,
            searchDataView: searchDataView
        }
        if(view.Editor){
            const editorDataViewKey = this.getDataViewKeyFromUUID(view.Editor!)
            const [editor, editorDataView] = await Promise.all([
                this.getEditor(view.Editor!),
                this.getDataView(`GV_${editorDataViewKey}_Editor`)

            ])    
            result.editor = editor,
            result.editorDataView = editorDataView
        }
        return result
    }

    async getSelectionList(viewKey: string | undefined, resourceName: string | undefined){
        let view: View
        if(viewKey){
            view = await this.getView(viewKey) as View
        }else{
            view = await this.getDefaultView(resourceName!) as View;
        }
        const dataViewKey = this.getDataViewKeyFromUUID(view.Key)
        const dataview = await this.getDataView(`GV_${dataViewKey}_View`) as GridDataView
        const smartSearchDataView = await this.getDataView(`GV_${dataViewKey}_SmartSearch`) as MenuDataView
        const searchDataView = await this.getDataView(`GV_${dataViewKey}_Search`) as MenuDataView
        return {
            view: view,
            viewDataview: dataview,
            filter: toApiQueryString(view.Filter) || '',
            smartSearchDataView: smartSearchDataView,
            searchDataView: searchDataView
        }
    }
    private async getDefaultView(resourceName: string){
        const views = await this.getViews()
        const viewsOfCurrentResource = views.filter(view => view.Resource?.Name == resourceName)
        const sortedViewsByCreationDataTime =  viewsOfCurrentResource.sort((a,b) => new Date(a.CreationDateTime).getTime() - new Date(b.CreationDateTime).getTime())
        if(sortedViewsByCreationDataTime.length > 0){
            return sortedViewsByCreationDataTime[0]
        }
        return undefined
    }
    private async getViews(): Promise<any>{
        return (await pepperi.addons.data.uuid(AddonUUID).table('views').search({})).Objects
    }
    private async getView(viewKey: string): Promise<View>{
        return await pepperi.addons.data.uuid(AddonUUID).table('views').key(viewKey).get()
    }
    private async getDataView(dataviewKey: string){
        const ctx = {Name: dataviewKey, Profile: { Name: 'Rep'}} as DataViewContext
        const dvObject = await pepperi.UIObject.Create(ctx)
        return dvObject?.dataView
    }
    private async getEditor(editorKey: string){
        return await pepperi.addons.data.uuid(AddonUUID).table('editors').key(editorKey).get()
    }
    private getDataViewKeyFromUUID(uuid: string){
        return uuid.replace(/-/g, '')
    }
}
