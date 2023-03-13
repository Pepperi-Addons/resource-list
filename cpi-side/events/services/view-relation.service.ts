import { AddonsDataSearchResult } from "@pepperi-addons/cpi-node/build/cpi-side/client-api";
import { DataRow, ViewBlock } from "shared"
import { groupRelationBlocks } from "../helpers/utils";
import { RelationBlock } from "../metadata";

export class ViewRelationService{
    
    async getRows(searchResult: AddonsDataSearchResult, blocks: ViewBlock[]): Promise<DataRow[]>{
        const relationGroups = groupRelationBlocks(blocks)
        const gridArray = await this.drawRows(relationGroups, blocks, searchResult)
        debugger
        const result: DataRow[] = []
        //iterate over all the grids we get, and merge the rows by the same order
        //TODO grid array suppose to be array of grids and not array of rows!
        gridArray.forEach(grid => {
            const row = grid.reduce((acc, curr) => {
                return {...acc, ...curr}
            }, {})
            result.push(row)
        })
        return result
    }

    private async drawRows(relationBlocks: RelationBlock[], viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult){
        return Promise.all(relationBlocks.map(async relationBlock => {
            return await this.drawRow(relationBlock, viewBlocks, searchResult)
        }))
    }

    private async drawRow(block: RelationBlock, viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult): Promise<DataRow[]>{
        const result =  await pepperi.addons.api.uuid(block.AddonUUID).post({
            url: block.DrawURL,
            body: { Data: searchResult.Objects , ViewBlocks: viewBlocks }
        })
        if(!result.Data){
            throw new Error(`in draw blocks - addon with uuid ${block.AddonUUID} inside draw url ${block.DrawURL} doesn't return object of type RowData[]`)
        }
        return result.Data
    }

}