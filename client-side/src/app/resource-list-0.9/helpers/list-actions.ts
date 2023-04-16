import { IPepGenericListActions } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { MenuBlock } from "shared";
import { ILineMenuHandler } from "./pepperi-list";

export class ListActions implements IPepGenericListActions{

    constructor(private lineMenuHandler: ILineMenuHandler){
    }
    /**
     * this function returns the line menu action in the first invocation, in all other invocation this function
     * output line selected event to the pepperi list
     * @param data - the line that were selected
     * @returns  array of line actions which is title and handler
     */
    async get(data: PepSelectionData): Promise<{ title: string; handler: (obj: any) => Promise<void>; }[]> {
        const lineMenuActions = this.lineMenuHandler.getLineMenuBlocksArray().map(block => {
            return {
                title: block.Title,
                handler: async (selectedRows: PepSelectionData) => this.lineMenuHandler.onMenuClick(block.Key, selectedRows)
            }
        })
        await this.lineMenuHandler.onLineSelected(data)
        return lineMenuActions
    }

}
