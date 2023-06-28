import { AddonsDataSearchResult } from "@pepperi-addons/cpi-node/build/cpi-side/client-api";
import { DataRow, ViewBlock } from "shared"
import { groupRelationBlocks } from "../helpers/utils";
import { DrawGridDefaultURL, RelationBlock } from "../metadata";
import config from '../../../addon.config.json'
export class ViewRelationService{
    
    async getRows(searchResult: AddonsDataSearchResult, blocks: ViewBlock[]): Promise<DataRow[]>{
        //put default addon uuid and draw url if not exist
        blocks.forEach(block => {
            block.AddonUUID = block.AddonUUID || config.AddonUUID
            block.DrawURL = block.DrawURL || DrawGridDefaultURL
        })
        const relationGroups = groupRelationBlocks(blocks as RelationBlock[])
        const gridArray = await this.drawLists(relationGroups, blocks, searchResult)

        //find the grid with the minimum number of objects
        const minLength = gridArray.reduce((acc, curr) => Math.max(acc, curr.length), -Infinity)
        const result: DataRow[] = []

        for(let i = 0; i < minLength; i++){
            const ithRow = gridArray.reduce((row, currentGrid) => {
                return {...row, ...(currentGrid[i] || {})}
            }, {})
            result.push(ithRow)
        }

        return result
    }

    private async drawLists(relationBlocks: RelationBlock[], viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult){
        return Promise.all(relationBlocks.map(async relationBlock => {
            return await this.drawList(relationBlock, viewBlocks, searchResult)
        }))
    }

    private async drawList(block: RelationBlock, viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult): Promise<DataRow[]>{
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