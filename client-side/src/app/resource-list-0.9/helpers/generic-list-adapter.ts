import { ListContainer, ListMenuBlock } from "shared";
import { GridViewBlockAdapter } from "./view-blocks-adapters/grid-view-blocks-adapter";
import { GridDataView } from "@pepperi-addons/papi-sdk";
import { GenericListAdapterResult, SmartSearchInput } from "../metadata";
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { GVButton } from "../metadata"
import { PepStyleType } from "@pepperi-addons/ngx-lib";
import { PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { ILineMenuHandler } from "./pepperi-list";
import { ListActions } from "./list-actions";
import { ViewBlocksAdapterFactory } from "./view-blocks-adapters/view-blocks-adapter";
import { IPepGenericListInitData } from "@pepperi-addons/ngx-composite-lib/generic-list";

export class GenericListAdapter {
    constructor(private listContainer: Partial<ListContainer>,  private lineMenuHandler: ILineMenuHandler){

    }
    adapt(): GenericListAdapterResult{
        const dataView = this.getDataView()
        const smartSearch = this.getSmartSearch()
        const menu = this.getMenu()
        const buttons = this.getButtons()
        const search = this.getSearch()
        const title = this.getTitle()
        const selectionType = this.getSelectionType()
        return {
            dataView: dataView,
            smartSearch: smartSearch,
            menu: menu,
            buttons: buttons,
            search: search,
            title: title,
            selectionType: selectionType,
            viewsMenu: this.listContainer?.Layout?.ViewsMenu,
            selectedViewKey: this.listContainer?.Layout?.View?.Key
        }
    }
    /**
     * if the view blocks of the selected view are changed,
     * or that the data itself changed return dataSource otherwise return undefined
     */
    getDataView(): IPepGenericListInitData['dataView'] | undefined{
        //first we can set the data and then update the dataview if needed
        if(this.listContainer.Layout?.View){
            const viewBlocksAdapter = ViewBlocksAdapterFactory.create(this.listContainer.Layout.View.Type, this.listContainer.Layout.View.ViewBlocks?.Blocks)
            const dataview = viewBlocksAdapter.adapt()
            return dataview
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
    
    getSearch(): boolean | undefined{
        return this.listContainer?.Layout?.Search?.Visible
    }

    getTitle(): string | undefined {
        return this.listContainer?.Layout?.Title
    }
}