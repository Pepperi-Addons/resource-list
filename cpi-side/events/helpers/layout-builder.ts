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
    build(): Promise<Partial<ListLayout>>
}


export class ListLayoutBuilder implements IListLayoutBuilder{
    private listModel: Partial<ListLayout> = {}

    constructor(private list: List,private prevState: ListState | undefined,  private currState: ListState){
        this.listModel.Key = list.Key
        this.listModel.Title = list.Name
    }

    
    async build(): Promise<Partial<ListLayout>>{
        return this.search(this.list.Search) 
        .smartSearch(this.list.SmartSearch) 
        .selectionType(this.list.SelectionType) 
        .views(this.list.Views, this.currState.ViewKey)
        .menu(this.list.LineMenu).then(self => {
            return self.menu(this.list.Menu).then(self => self.listModel as Partial<ListLayout>)
        })
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

    async menu(menuConfiguration: ListMenu = {Blocks: []}): Promise<ListLayoutBuilder>{
        const menuBuilder = new MenuBuilder()
        const menu = await menuBuilder.build(menuConfiguration, this.currState, this.prevState)
        debugger
        this.listModel.Menu = menu
        return this
    }

    // buttons(menuConfiguration: ListMenu = {Blocks: []}): ListModelBuilder{
    //     const result: Buttons = {
    //         buttons: []
    //     }
        
    //     result.buttons = menuConfiguration.Blocks.filter(block => block.Button)
    //     this.listModel.Buttons = result
    //     return this
    // }
    
    search(search: ListSearch = {Fields: []}): ListLayoutBuilder{
        this.listModel.Search = search.Fields.length > 0
        return this
    }

    smartSearch(smartSearch: ListSmartSearch = {Fields: []}){
       this.listModel.SmartSearch = {
            Fields: smartSearch.Fields
        }
        return this
    }

    // lineMenu(lineMenu: ListMenu){
    //     const result: ListMenu = {
    //     }
    //     result.Menu.Fields = lineMenu.Blocks.map(lineMenuBlock => {
    //         return {
    //             FieldID: lineMenuBlock.Key,
    //             Title: lineMenuBlock.Title
    //         }
    //     })
    //     this.listModel.LineMenu = result
    //     return this
    // }

    views(views: View[] = [], viewKey?: string): ListLayoutBuilder{
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
        //get the fields in order to search the items
        // const fields: string[] = viewBlocks.map(viewBlocks => viewBlocks.Configuration.FieldID) as string[]
        // //add key if missing
        // if(!fields.includes('Key')){
        //     fields.push('Key')
        // }
        // //convert filter to query string
        // const query = toApiQueryString(this.list.Filter) || ''
        // //get the relation function, for now it is hard coded
        // const resourceService = new GenericResourceService()
        // const items = await resourceService.getItems(this.list.Resource, {where: query} ,fields)
        // const gridCellOutput = getCellBlock({Items: items.Objects, ViewBlocks: viewBlocks})
        // const rows: GridCell[] = []
        // gridCellOutput.GridData.map(gridRow => {
        //     //take the current row and convert it to an object
        //    const row = gridRow.reduce((acc, curr) => acc = {...acc, ...curr},{})
        //    rows.push(row)
            
        // })
        // //add items 
        // // result.Items = rows
        // this.listModel.View = result
        // return this
    }

    selectionType(selectionType: SelectionType = "None"){
        this.listModel.SelectionType = selectionType
        return this
    }

    sorting(sorting: Sorting = {Ascending: false, FieldID: 'CreationDateTime'}){
        this.listModel.Sorting = sorting
        return this
    }
}