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

        await  this.search(this.list.Search) 
        .smartSearch(this.list.SmartSearch) 
        .selectionType(this.list.SelectionType) 
        .views(this.list.Views, this.changes.ViewKey)
        .title(this.list.Name)
        .lineMenu(this.list.LineMenu).then(self => {
            return self.menu(this.list.Menu).then(self => self.listModel as Partial<ListLayout>)
        })
        //in case there was no changes we will return undefined
        return Object.keys(this.listModel).length == 0? undefined: this.listModel
    }
    /**
     * this function will set a title only when to list is changed
     * @param name string 
     * @returns this
     */
    title(name: string){
        if(this.changes.ListKey){
            this.listModel.Title = name
        }
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
    async menu(menuConfiguration: ListMenu = {Blocks: []}): Promise<ListLayoutBuilder>{
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
    async lineMenu(lineMenuConfiguration: ListMenu = {Blocks: []}):  Promise<ListLayoutBuilder>{
        const lineMenu = await this.buildMenu(lineMenuConfiguration)
        //if the line menu is undefined, we don't need to re render it
        if(lineMenu){
            this.listModel.LineMenu = lineMenu
        }
        return this
    }

    /**
     * this function will return Search element
     * the search will be visible only if some fields are configured to be search on
     * and function will return undefined if no change on search state is required
     * @param search - the search configuration 
     * @param state - the current state
     * @param changes - the changes on the state that emit this event
     */
    search(search: ListSearch = {Fields: []}): ListLayoutBuilder{
        //the only case when we return a search is when we changed the list
        if(!this.changes.ListKey){
            return this
        }
        this.listModel.Search =  { Visible: search.Fields.length > 0 }
        return this
    }
    /**
     * this function will add smart search to the layout only if that list was changed
     * @param smartSearch the configuration of the smart search
     * @returns this 
     * 
     */
    smartSearch(smartSearch: ListSmartSearch = {Fields: []}){
        //if there is a state we don't want to re render the smart search component
        if(!this.changes.ListKey){
            return this
        }

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
    views(views: View[] = [], viewKey?: string): ListLayoutBuilder{
        //if we didn't change the list and we didn't change the view then we don't need to rerender the views menu or the selected view 
        if(!this.changes.ListKey && !this.changes.ViewKey){
            return this
        }
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

        //add title  type  and view blocks to the view
        result.Type = selectedView.Type
        // result.Title = selectedView.Title
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
    selectionType(selectionType: SelectionType = "None"){
        if(!this.changes.ListKey){
            return this
        }
        this.listModel.SelectionType = selectionType
        return this
    }
    /**
     * the sorting will changed only when the list is changed
     * @param sorting - the sorting field and order
     * @returns this
     */
    sorting(sorting: Sorting = {Ascending: false, FieldID: 'CreationDateTime'}){
        if(!this.changes.ListKey){
            return this
        }
        this.listModel.Sorting = sorting
        return this
    }
}