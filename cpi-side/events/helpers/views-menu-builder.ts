import { List, ListState, ListView, View, ViewLayout, ViewsMenu } from "shared";
import { createDropDown } from "./utils";

export class ViewsBuilder{

    constructor(){}

    build(list: List, state: Partial<ListState> | undefined, changes: Partial<ListState>): { View: ViewLayout, ViewsMenu: ViewsMenu } | null{
        //case we don't need to render the view
        if(!changes.ListKey && !changes.ViewKey){
            return null
        }
        //so here we must render the views menu and the selected view

        //extract views menu and view key
        const views = list.Views
        const viewKey = state?.ViewKey || changes.ViewKey

        //prepare default result
        const result: {View: ViewLayout, ViewsMenu: ViewsMenu} = {
            View: {
                Key: "",
                ViewBlocks: {
                    Blocks: []
                },
                Type: "Grid"
            },
            ViewsMenu: {
                Visible: false,
                Items: []
            }
        }

        //in case we don't have any view we will return the default result
        if(views.length == 0){
            return result
        }

        //extract the selected view key if exist, if not the first view will be the selected view
        let indexOfSelectedView = views.findIndex(view => view.Key == viewKey)
        if(indexOfSelectedView == -1){
            indexOfSelectedView = 0
        }

        //rearrange views s.t the selected views will be the first
        const selectedView = views[indexOfSelectedView]
        views.splice(indexOfSelectedView, 1)
        views.unshift(selectedView)

        //build the views drop down
        const viewsMenu = this.createViewsMenu(views)

        //update the result object
        result.ViewsMenu = viewsMenu
        result.View.Type = selectedView.Type
        result.View.ViewBlocks.Blocks = selectedView.Blocks
        result.View.Key = selectedView.Key

        return result
    }

    private createViewsMenu(views: ListView[] = []){
        const result: ViewsMenu = {
            Visible: false,
            Items: []
        }
        result.Items = createDropDown(views, 'Key', 'Title')
        result.Visible = result.Items.length > 0
        return result
    }


    
}