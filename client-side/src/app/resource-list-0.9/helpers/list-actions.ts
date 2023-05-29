import { IPepGenericListActions } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { MenuBlock } from "shared";
import { ILineMenuHandler } from "./pepperi-list";

export class ListActions implements IPepGenericListActions{
    lineMenuActions: { title: string; handler: (obj: any) => Promise<void>; }[]

    constructor(private lineMenuBlocks: MenuBlock[] = [], private lineMenuHandler: ILineMenuHandler){
        this.lineMenuActions = this.lineMenuBlocks.map(block => {
            return {
                title: block.Title,
                handler: async (selectedRows: PepSelectionData) => this.lineMenuHandler.onMenuClick(block.Key, selectedRows)
            }
        })
    }
    /**
     * this function returns the line menu action in the first invocation, in all other invocation this function
     * output line selected event to the pepperi list
     * @param data - the line that were selected
     * @returns  array of line actions which is title and handler
     */
    async get(data: PepSelectionData): Promise<{ title: string; handler: (obj: any) => Promise<void>; }[]> {
        debugger
        await this.lineMenuHandler.onLineSelected(data)
        return this.lineMenuActions
    }

}
