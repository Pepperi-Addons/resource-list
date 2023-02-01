import { toApiQueryString } from "@pepperi-addons/pepperi-filters";
import { List, SelectionType } from "../../../lists/models/list.model";
import { LineMenuConfiguration, MenuBlock, MenuConfiguration } from "../../../lists/models/menu.model";
import { SearchConfiguration, SmartSearchConfiguration } from "../../../lists/models/search.model";
import { GenericResourceService } from "../../../services/generic-resource.service";
import { Buttons, ListMenu, ListModel, ResourceView, ViewsMenu } from "../models/list-model.model";
import { ListState } from "../../models/list-state.model";
import { GridCell, createDropDown, getCellBlock } from "../../utils/utils";


export interface IListModelBuilder{
    build(): Promise<ListModel>
}


export class ListModelBuilder implements IListModelBuilder{
    private listModel: Partial<ListModel> = {}

    constructor(private list: List, private state: ListState){
        this.listModel.Key = list.Key
        this.listModel.Title = list.Title
    }

    async build(): Promise<ListModel>{
        return this.menu(this.list.Menu)
        .buttons(this.list.Menu)
        .lineMenu(this.list.LineMenu)
        .search(this.list.Search)
        .smartSearch(this.list.SmartSearch)
        .selectionType(this.list.SelectionType)
        .views(this.list.Views, this.state.ViewKey)
        .then(listModelBuilder => listModelBuilder.listModel as ListModel)
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

    menu(menuConfiguration: MenuConfiguration = {Blocks: []}): ListModelBuilder{
        const result: ListMenu = {
            Menu: {
                Type: 'Menu',
                Fields: []
            }
        }
        result.Menu.Fields = menuConfiguration.Blocks.filter(block => !block.Button).map(menuBlock => {
            return {
                FieldID: menuBlock.Key,
                Title: menuBlock.Title
            }
        })
        this.listModel.Menu = result
        return this
    }

    buttons(menuConfiguration: MenuConfiguration = {Blocks: []}): ListModelBuilder{
        const result: Buttons = {
            buttons: []
        }
        
        result.buttons = menuConfiguration.Blocks.filter(block => block.Button)
        this.listModel.Buttons = result
        return this
    }
    
    search(search: SearchConfiguration = {Fields: []}): ListModelBuilder{
        this.listModel.Search = search.Fields.length > 0
        return this
    }

    smartSearch(smartSearch: SmartSearchConfiguration = {Fields: []}){
       this.listModel.SmartSearch = {
            Type: 'Menu',
            Fields: smartSearch.Fields
        }
        return this
    }

    lineMenu(lineMenu: LineMenuConfiguration){
        const result: ListMenu = {
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

    async views(views: View[] = [], viewKey?: string): Promise<ListModelBuilder>{
        const result: ResourceView = {
            ViewBlocks: {
                Fields: []
            },
            Items: [],
            Title: '',
            Type: "Grid"

        }

        if(views.length == 0){
            this.listModel.SelectedView = result
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
        result.Title = selectedView.Title
        result.ViewBlocks.Fields = selectedView.ViewBlocks

        const viewBlocks = selectedView.ViewBlocks

        //get the fields in order to search the items
        const fields: string[] = viewBlocks.map(viewBlocks => viewBlocks.Configuration.FieldID) as string[]
        //add key if missing
        if(!fields.includes('Key')){
            fields.push('Key')
        }
        //convert filter to query string
        const query = toApiQueryString(this.list.Filter) || ''
        //get the relation function, for now it is hard coded
        const resourceService = new GenericResourceService()
        const items = await resourceService.getItems(this.list.Resource, {where: query} ,fields)
        const gridCellOutput = getCellBlock({Items: items.Objects, ViewBlocks: viewBlocks})
        const rows: GridCell[] = []
        gridCellOutput.GridData.map(gridRow => {
            //take the current row and convert it to an object
            const row = gridRow.reduce((acc, curr) => acc = {...acc, ...curr},{})
           rows.push(row)
            
        })
        //add items 
        result.Items = rows
        this.listModel.SelectedView = result
        return this
    }

    selectionType(selectionType: SelectionType = "none"){
        this.listModel.SelectionType = selectionType
        return this
    }

    sorting(sorting: Sorting = {Ascending: false, FieldID: 'CreationDateTime'}){
        this.listModel.Sorting = sorting
        return this
    }

}