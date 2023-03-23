import { IPepGenericListActions } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { Menu } from "shared";
import { ILineMenuHandler } from "./pepperi-list";

export class LineMenuExecutor implements IPepGenericListActions{
    isFirstInvocation: boolean = true
    lineMenuActions: { title: string; handler: (obj: any) => Promise<void>; }[]

    constructor(private lineMenu: Menu, private lineMenuHandler: ILineMenuHandler){
        this.lineMenuActions = this.lineMenu.Blocks.map(block => {
            return {
                title: block.Title,
                handler: async (selectedRows) => this.lineMenuHandler.onMenuClick(block.Key)
            }
        })
    }
    async get(data: PepSelectionData): Promise<{ title: string; handler: (obj: any) => Promise<void>; }[]> {
        if(this.isFirstInvocation){
            this.isFirstInvocation = false
            return this.lineMenuActions
        }
        await this.lineMenuHandler.onLineSelected(data)
        //execute line selected
        return this.lineMenuActions
    }

}
