import { AddonsDataSearchResult } from "@pepperi-addons/cpi-node/build/cpi-side/client-api";
import { ViewBlock } from "../../models/configuration/view.model";
import { groupRelationBlocks } from "../helpers/utils";
import { Row, RelationBlock } from "../metadata";

export class ViewRelationService{
    
    async getRows(searchResult: AddonsDataSearchResult, blocks: ViewBlock[]): Promise<Row[]>{
        const relationGroups = groupRelationBlocks(blocks)
        const gridArray = await this.drawRows(relationGroups, blocks, searchResult)
        const result: Row[] = []
        //iterate over all the grids we get, and merge the rows by the same order
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

    private async drawRow(block: RelationBlock, viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult): Promise<Row[]>{
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