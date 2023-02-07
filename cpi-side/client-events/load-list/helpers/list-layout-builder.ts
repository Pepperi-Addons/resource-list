import { toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { List, SelectionType } from "../../../lists/models/list.model";
import { GenericResourceService } from "../../../services/generic-resource.service";
import {  ListLayout, Menu, ViewLayout, ViewsMenu } from "../models/list-model.model";
import { ListState } from "../../models/list-state.model";
import { GridCell, createDropDown, getCellBlock } from "../../utils/utils";
import { ListSearch, ListSmartSearch } from "../../../lists/models/search.model";
import { ListMenu } from "../../../lists/models/menu.model";


export interface IListLayoutBuilder{
    build(): ListLayout
}


export class ListLayoutBuilder implements IListLayoutBuilder{
    private listModel: Partial<ListLayout> = {}

    constructor(private list: List,private prevState: ListState | undefined,  private state: ListState){
        this.listModel.Key = list.Key
        this.listModel.Title = list.Name
    }

    build(): ListLayout{
        return this.menu(this.list.Menu)
        // .buttons(this.list.Menu)
        // .lineMenu(this.list.LineMenu)
        .search(this.list.Search) //if prev state is null then rerender
        .smartSearch(this.list.SmartSearch) //if prev state is null then rerender
        .selectionType(this.list.SelectionType) //if prev state is null then rerender
        .views(this.list.Views, this.state.ViewKey) //if prev state is null then rerender
        .listModel as ListLayout
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

    menu(menuConfiguration: ListMenu = {Blocks: []}): ListLayoutBuilder{
        const result: Menu = {
            Menu: {
                Type: 'Menu',
                Fields: []
            }
        }
        //for every menu block, if needsToBeRendered of all of them is false return result
        /** TODO needs to call the relation function to tell if its needs to be rendered according to prev state and curr state*/
        result.Menu.Fields = menuConfiguration.Blocks.filter(block => !block.ButtonStyleType).map(menuBlock => {
            return {
                FieldID: menuBlock.Key,
                Title: menuBlock.Title
            }
        })
        this.listModel.Menu = result
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
            Type: 'Menu',
            Fields: smartSearch.Fields
        }
        return this
    }

    lineMenu(lineMenu: ListMenu){
        const result: Menu = {
            Menu: {
                Type: 'Menu',
                Fields: []
            }
        }
        result.Menu.Fields = lineMenu.Blocks.map(lineMenuBlock => {
            return {
                FieldID: lineMenuBlock.Key,
                Title: lineMenuBlock.Title
            }
        })
        this.listModel.LineMenu = result
        return this
    }

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
        result.ViewBlocks.Fields = selectedView.ViewBlocks

        const viewBlocks = selectedView.ViewBlocks
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