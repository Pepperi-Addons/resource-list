import { List, SelectionType, ListMenu, ListSearch, ListSmartSearch, Sorting, ListView as View, ListLayout, ViewLayout, ViewsMenu, ListState } from "shared"
import { MenuBuilder } from "./menu-builder";
import { createDropDown } from "./utils";
import { SelectionTypeBuilder } from "./selection-type.builder";
import { TitleBuilder } from "./title-builder";
import { SearchBuilder } from "./search-builder";
import { SmartSearchBuilder } from "./smart-search-builder";
import { SortingBuilder } from "./sorting-builder";
import { ViewsBuilder } from "./views-menu-builder";

export interface IListLayoutBuilder{
    build(): Promise<Partial<ListLayout | undefined>>
}


export class ListLayoutBuilder implements IListLayoutBuilder{
    private listModel: Partial<ListLayout> = {}

    constructor(private list: List,private state: Partial<ListState>,  private changes: Partial<ListState>){
    }

    /**
     * this function will build the part that were changed on the list layout.
     * if there is no change on the list layout this function will return undefined
     * @returns the changes on the list layout
     */
    async build(): Promise<Partial<ListLayout> | undefined>{
        await Promise.all([this.menu(this.list.Menu), this.lineMenu(this.list.LineMenu)])
        this.search() 
        .smartSearch() 
        .selectionType() 
        .views()
        .title()
        .sorting()

        //in case there was no changes we will return undefined
        return Object.keys(this.listModel).length == 0? undefined: this.listModel
    }

    /**
     * this function will set a title only when to list is changed
     * @returns this
     */
    private title(){
        const builder = new TitleBuilder()
        const title = builder.build(this.list, this.state, this.changes)
        if(title){
            this.listModel.Title = title
        }
        return this
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
        let menu =  await menuBuilder.build(menuConfiguration, this.state, this.changes)
        //if we are loading the list, the default value of menu needs to be an empty array
        if(this.changes.ListKey && !menu){
            menu = {Blocks: []}
        }
        return menu
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
     * @returns this
     */
    private search(): ListLayoutBuilder{
        const builder = new SearchBuilder()
        const search = builder.build(this.list, this.state, this.changes)
        if(search){
            this.listModel.Search =  search

        } 
        return this
    }
    /**
     * this function will add smart search to the layout only if that list was changed
     * @returns this 
     * 
     */
    private smartSearch(){
        const builder = new SmartSearchBuilder()
        const smartSearch = builder.build(this.list, this.state, this.changes)
        if(smartSearch){
            this.listModel.SmartSearch = smartSearch

        }
        return this
    }
    /**
     * this function will add the views to the list layout only if the state is undefined or that the changes object contains view key
     * @returns this
     */
    private views(): ListLayoutBuilder{
        const builder = new ViewsBuilder()
        const views = builder.build(this.list, this.state, this.changes)

        if(views){
            this.listModel.View = views.View
            this.listModel.ViewsMenu = views.ViewsMenu
        }
        return this
    }
    /**
     * this function will set the selection type only if the list is changed
     * @returns this
     */
    private selectionType(){
        const builder = new SelectionTypeBuilder()
        const selectionType = builder.build(this.list, this.state, this.changes)
        if(selectionType){
            this.listModel.SelectionType = selectionType
        }
        return this
    }
    /**
     * the sorting will changed only when the list is changed
     * @returns this
     */
    private sorting(){
        const builder = new SortingBuilder()
        const sorting = builder.build(this.list, this.state, this.changes)
        if(sorting){
            this.listModel.Sorting = sorting
        }
        return this
    }
}