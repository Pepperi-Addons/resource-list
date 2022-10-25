import { Client } from "@pepperi-addons/debug-server/dist";
import { GridDataView } from "@pepperi-addons/papi-sdk";
import { IGenericViewer, View } from "../../shared/entities";
import { DataViewsService } from "./dataviews.service";
import { EditorsService } from "./editors.service";
import { ViewsService } from "./views.service";


export class GenericViewerService  {
    constructor(private client: Client){
     }

    //this method assume that the view always exist
    async getGenericView(viewKey: string){
        const viewService = new ViewsService(this.client)
        const dataViewService = new DataViewsService(this.client)
        const editorService = new EditorsService(this.client)
        const dataViewKey = viewKey.replace(/-/g, '')
        const [[view],[viewDataview], [lineMenuItems], [menuItems]] = await Promise.all([
            viewService.getItems({where: `Key="${viewKey}"`}),
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
            editorDataView: undefined
        }
        if(view.Editor){
            const editorDataViewKey = view.Editor.replace(/-/g, '')
            const [[editor], [editorDataView]] = await Promise.all([
                editorService.getItems({where: `Key = "${view.Editor}"`}),
                dataViewService.getDataView(`GV_${editorDataViewKey}_Editor`)

            ])    
            result.editor = editor,
            result.editorDataView = editorDataView
        }
        return result
    }

    async getSelectionList(key: string | undefined, resource: string | undefined): Promise<IGenericViewer>{
        let view: View
        const viewsService = new ViewsService(this.client)
        const dataViewService = new DataViewsService(this.client)
        if(!key){
            view = await viewsService.getDefaultView(resource!) as View;
        }else{
            [view] = await viewsService.getItems({where: `Key="${key}"`}) as View[];
        }
        const dataViewKey = view.Key.replace(/-/g, '');
        const [dataview] = await dataViewService.getDataView(`GV_${dataViewKey}_View`) as GridDataView[]
        return {
            view: view,
            viewDataview: dataview
        }
    }
} 