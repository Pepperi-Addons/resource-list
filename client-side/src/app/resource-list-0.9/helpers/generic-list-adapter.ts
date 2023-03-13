import { ListContainer, ListMenuBlock } from "shared";
import { GridViewBlockAdapter } from "./view-blocks-adapter";
import { DataSource } from "./data-source";
import { MenuDataView, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { GenericListAdapterResult, SmartSearchField, SmartSearchInput } from "../metadata";
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { PepButton } from "@pepperi-addons/ngx-lib/button";
import { GVButton } from "src/app/generic-viewer/generic-viewer.model";
import { PepAddonService, PepStyleStateType, PepStyleType } from "@pepperi-addons/ngx-lib";
import { title } from "process";
import { ClientEventsService } from "../services/client-events.service";
import { Subject, async } from "rxjs";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";

export class GenericListAdapter {
    constructor(private listContainer: Partial<ListContainer>,  private lineMenuSubject: Subject<{key: string, data?: any}>){

    }
    adapt(): GenericListAdapterResult{
        const dataSource = this.getDataSource()
        const smartSearch = this.getSmartSearch()
        const menu = this.getMenu()
        const buttons = this.getButtons()
        const lineMenu = this.getLineMenu()
        return {
            dataSource: dataSource,
            smartSearch: smartSearch,
            menu: menu,
            buttons: buttons,
            lineMenu: lineMenu
        }
    }
    /**
     * if the view blocks of the selected view are changed,
     * or that the data itself changed return dataSource otherwise return undefined
     */
    getDataSource(): DataSource | undefined{
        //first we can set the data and then update the dataview if needed
        if(this.listContainer.Layout?.View){
            const viewBlocksAdapter = new GridViewBlockAdapter(this.listContainer.Layout.View.ViewBlocks?.Blocks)
            const dataview = viewBlocksAdapter.adapt()
            return new DataSource(dataview, [{name: 'a', age: 1}])
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
                    styleType: this.listStyleTypeToNgxStyleType(menuBlock.ButtonStyleType || 'Regular')
                }
            })
        }
        return undefined
    }

    private listStyleTypeToNgxStyleType(type: ListMenuBlock['ButtonStyleType']): PepStyleType{
        switch(type){
            case 'Regular':
            case 'Strong':
            case 'Weak':
                return type.toLowerCase() as PepStyleType
            case 'WeakInvert':
                return 'weak-invert'
            default:
                throw Error(`style type ${type} is not supported`)
        }
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
}