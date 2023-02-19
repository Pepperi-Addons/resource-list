import { AddonsDataSearchResult } from "@pepperi-addons/cpi-node/build/cpi-side/client-api";
import { GridRow, ViewBlock } from "shared"
import { groupRelationBlocks } from "../helpers/utils";
import { RelationBlock } from "../metadata";

export class GridViewRelationService{
    
    async getGridRows(searchResult: AddonsDataSearchResult, blocks: ViewBlock[], resource: string): Promise<GridRow[]>{
        const relationGroups = groupRelationBlocks(blocks)
        const gridArray = await this.drawGrids(relationGroups, resource, blocks, searchResult)
        const result: GridRow[] = []
        //iterate over all the grids we get, and merge the rows by the same order
        gridArray.forEach(grid => {
            const row = grid.reduce((acc, curr) => {
                return {...acc, ...curr}
            }, {})
            result.push(row)
        })
        return result
    }

    private async drawGrids(relationBlocks: RelationBlock[], resource: string, viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult){
        return Promise.all(relationBlocks.map(async relationBlock => {
            return await this.drawGrid(relationBlock, resource, viewBlocks, searchResult)
        }))
    }

    private async drawGrid(block: RelationBlock, resource: string, viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult): Promise<GridRow[]>{
        const result =  await pepperi.addons.api.uuid(block.AddonUUID).post({
            url: block.DrawURL,
            body: { Data: searchResult.Objects , ViewBlocks: viewBlocks }
        })
        if(!result.GridData){
            throw new Error(`in draw grid blocks - addon with uuid ${block.AddonUUID} inside draw url ${block.DrawURL} doesn't return object of type GridViewOutputData`)
        }
        return result.GridData
    }

}