import { List, SelectionType } from "../../models/configuration/list.model";
import { ListMenu } from "../../models/configuration/menu.model";
import { ListSearch, ListSmartSearch } from "../../models/configuration/search.model";
import { Sorting } from "../../models/configuration/sorting.model";
import { View } from "../../models/configuration/view.model";
import { ListLayout, ViewLayout, ViewsMenu } from "../../models/events/list-layout.model";
import { ListState } from "../../models/events/list-state.model";
import { MenuBuilder } from "./menu-builder";
import { createDropDown } from "./utils";

export interface IListLayoutBuilder{
    build(): Promise<Partial<ListLayout | undefined>>
}


export class ListLayoutBuilder implements IListLayoutBuilder{
    private listModel: Partial<ListLayout> = {}

    constructor(private list: List,private state: ListState | undefined,  private changes: Partial<ListState>){
    }

    /**
     * this function will build the part that were changed on the list layout.
     * if there is no change on the list layout this function will return undefined
     * @returns the changes on the list layout
     */
    async build(): Promise<Partial<ListLayout> | undefined>{
        //the rerendering of the menu and line menu are dependent on the addon that supplies the blocks
        await Promise.all([this.menu(this.list.Menu), this.lineMenu(this.list.LineMenu)])

        //views are changed only when we change the list or the view
        if(this.changes.ViewKey){
            this.views(this.list.Views, this.changes.ViewKey)
        }
        //all the others will rerender only when we change the list
        if(this.changes.ListKey){
            this.search(this.list.Search) 
            .smartSearch(this.list.SmartSearch) 
            .selectionType(this.list.SelectionType) 
            .views(this.list.Views, this.changes.ViewKey)
            .title(this.list.Name)
            .sorting(this.list.Sorting)
        }

        //in case there was no changes we will return undefined
        return Object.keys(this.listModel).length == 0? undefined: this.listModel
    }
    /**
     * this function will set a title only when to list is changed
     * @param name string 
     * @returns this
     */
    title(name: string){
        this.listModel.Title = name
        return this
    }

    private createViewsMenu(views:View[] = []){
        const result: ViewsMenu = {
            Visible: false,
            Items: []
        }
        result.Items = createDropDown(views, 'Key', 'Title')
        result.Visible = result.Items.length > 0
        this.listModel.ViewsMenu = result
        return
    }
    /**
     * this function will set the menu on the list layout if the menu needs to be rendered.
     * @param menuConfiguration 
     * @returns this
     */
    private async menu(menuConfiguration: ListMenu = {Blocks: []}): Promise<ListLayoutBuilder>{
        const menu = await this.buildMenu(menuConfiguration)
        //if the menu is undefined, we don't need to render the menu
        if(menu){
            this.listModel.Menu = menu
        }
        return this
    }
    private async buildMenu(menuConfiguration: ListMenu){
        const menuBuilder = new MenuBuilder()
        return await menuBuilder.build(menuConfiguration, this.state, this.changes)
    }
    /**
     * this function will set the line menu on the list layout if the line menu needs to be rendered.
     * @param lineMenuConfiguration 
     * @returns this
     */
    private async lineMenu(lineMenuConfiguration: ListMenu = {Blocks: []}):  Promise<ListLayoutBuilder>{
        const lineMenu = await this.buildMenu(lineMenuConfiguration)
        //if the line menu is undefined, we don't need to re render it
        if(lineMenu){
            this.listModel.LineMenu = lineMenu
        }
        return this
    }

    /**
     * the search will be visible only if some fields are configured to be search on
     * @param search - the search configuration 
     * @returns this
     */
    private search(search: ListSearch = {Fields: []}): ListLayoutBuilder{
        this.listModel.Search =  { Visible: search.Fields.length > 0 }
        return this
    }
    /**
     * this function will add smart search to the layout only if that list was changed
     * @param smartSearch the configuration of the smart search
     * @returns this 
     * 
     */
    private smartSearch(smartSearch: ListSmartSearch = {Fields: []}){
        this.listModel.SmartSearch = {
            Fields: smartSearch.Fields
        }
        return this
    }
    /**
     * this function will add the views to the list layout only if the state is undefined or that the changes object contains view key
     * @param views this list of views that configured on the list
     * @param viewKey optional, the view key of the selected view
     * @returns this
     */
    private views(views: View[] = [], viewKey?: string): ListLayoutBuilder{
        const result: ViewLayout = {
            ViewBlocks: {
                Fields: []
            },
            Type: "Grid"
        }

        if(views.length == 0){
            this.listModel.View = result
            return this
        }

        //if view key does not exist just take the first one
        let indexOfSelectedView = views.findIndex(view => view.Key == viewKey)
        if(indexOfSelectedView == -1){
            indexOfSelectedView = 0
        }

        //rearrange views s.t the selected views will be the first
        const selectedView = views[indexOfSelectedView]
        views.splice(indexOfSelectedView, 1)
        views.unshift(selectedView)

        //build the views drop down
        this.createViewsMenu(views)

        //add type and view blocks to the view
        result.Type = selectedView.Type
        result.ViewBlocks.Fields = selectedView.Blocks

        const viewBlocks = selectedView.Blocks
        this.listModel.View = result
        return this
    }
    /**
     * this function will set the selection type only if the list is changed
     * @param selectionType by default none
     * @returns this
     */
    private selectionType(selectionType: SelectionType = "Single"){
        this.listModel.SelectionType = selectionType
        return this
    }
    /**
     * the sorting will changed only when the list is changed
     * @param sorting - the sorting field and order
     * @returns this
     */
    private sorting(sorting: Sorting = {Ascending: false, FieldID: 'CreationDateTime'}){
        this.listModel.Sorting = sorting
        return this
    }
}