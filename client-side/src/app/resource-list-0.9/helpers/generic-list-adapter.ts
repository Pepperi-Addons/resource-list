import { ListContainer } from "shared";
import { ViewBlocksAdapter } from "./view-blocks-adapter";
import { GridDataView } from "@pepperi-addons/papi-sdk";
import { GenericListAdapterResult, SmartSearchInput } from "../metadata";
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { GVButton } from "src/app/generic-viewer/generic-viewer.model";
import { PepStyleType } from "@pepperi-addons/ngx-lib";
import { ClientEventsService } from "../services/client-events.service";
import { Subject } from "rxjs";
import { PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list";

export class GenericListAdapter {
    constructor(private listContainer: Partial<ListContainer>, private clientEventService: ClientEventsService, private lineMenuSubject: Subject<{key: string, data?: any}>){

    }
    adapt(): GenericListAdapterResult{
        const dataView = this.getDataView()
        const smartSearch = this.getSmartSearch()
        const menu = this.getMenu()
        const buttons = this.getButtons()
        const lineMenu = this.getLineMenu()
        const search = this.getSearch()
        const title = this.getTitle()
        const selectionType = this.getSelectionType()
        return {
            dataView: dataView,
            smartSearch: smartSearch,
            menu: menu,
            buttons: buttons,
            lineMenu: lineMenu,
            search: search,
            title: title,
            selectionType: selectionType
        }
    }
    /**
     * if the view blocks of the selected view are changed,
     * or that the data itself changed return dataSource otherwise return undefined
     */
    getDataView(): GridDataView | undefined{
        //first we can set the data and then update the dataview if needed
        if(this.listContainer.Layout?.View){
            const viewBlocksAdapter = new ViewBlocksAdapter(this.listContainer.Layout.View.ViewBlocks.Blocks)
            const dataview = viewBlocksAdapter.adapt()
            dataview
        }
        return undefined
    }

    getSelectionType(): PepListSelectionType | undefined{
        const selectionType = this.listContainer?.Layout?.SelectionType
        if(selectionType){
            return selectionType.toLowerCase() as PepListSelectionType
        }
        return undefined
    }

    getSmartSearch(): SmartSearchInput | undefined{
        if(this.listContainer.Layout?.SmartSearch){
            return {
                dataView: {
                    Type: 'Menu',
                    Fields: this.listContainer.Layout.SmartSearch.Fields
                }
            }
        }
        return undefined
    }
    //returns only the menu
    getMenu(): PepMenuItem[] | undefined{
        if(this.listContainer.Layout?.Menu){
            return this.listContainer.Layout.Menu.Blocks.filter(block => !block.ButtonStyleType && !block.Hidden).map(menuBlock => {
                return {
                    key: menuBlock.Key,
                    text: menuBlock.Title,
                }
            })
        }
        return undefined
    }

    getButtons(): GVButton[]{
        if(this.listContainer.Layout?.Menu){
            return this.listContainer.Layout.Menu.Blocks.filter(block => block.ButtonStyleType && !block.Hidden).map(menuBlock => {
                return {
                    key: menuBlock.Key,
                    value: menuBlock.Title,
                    styleType: menuBlock.ButtonStyleType.toLowerCase() as PepStyleType
                }
            })
        }
        return undefined
    }
    getLineMenu(){
        if(this.listContainer.Layout?.LineMenu){
            return {
                get: async (data: PepSelectionData) => {
                    return this.listContainer.Layout.LineMenu.Blocks.filter(block => !block.Hidden)
                    .map(block => {
                        return {
                            title: block.Title,
                            handler: async (selectedRows) => this.lineMenuSubject.next({key: block.Key, data: selectedRows})
                        }
                    })
                }
            }
        }
        return undefined
    }

    getSearch(): boolean | undefined{
        return this.listContainer?.Layout?.Search?.Visible
    }

    getTitle(): string | undefined {
        return this.listContainer?.Layout?.Title
    }
}