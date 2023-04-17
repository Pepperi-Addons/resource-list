import { IPepGenericListInitData } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { ViewBlock } from "shared";
import { GridViewBlockAdapter } from "./grid-view-blocks-adapter";

export interface IViewBlocksAdapter{
    adapt(): IPepGenericListInitData['dataView']
}

export class ViewBlocksAdapterFactory{
    static create(type: "Grid" | "Cards", viewBlocks: ViewBlock[]): IViewBlocksAdapter{
        switch (type){
            case "Grid":
                return new GridViewBlockAdapter(viewBlocks)
            default:
                throw Error(`view blocks adapter for type ${type} is not implemented yet`)
        }
    }
}
