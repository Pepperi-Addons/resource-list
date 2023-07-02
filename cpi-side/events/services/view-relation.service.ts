import { AddonsDataSearchResult } from "@pepperi-addons/cpi-node/build/cpi-side/client-api";
import { DataRow, ViewBlock } from "shared"
import { groupRelationBlocks } from "../helpers/utils";
import { DrawGridDefaultURL, RelationBlock } from "../metadata";
import config from '../../../addon.config.json'
export class ViewRelationService{
    
    async getRows(searchResult: AddonsDataSearchResult, blocks: ViewBlock[], resource: string): Promise<DataRow[]>{
        //put default addon uuid and draw url if not exist
        blocks.forEach(block => {
            block.AddonUUID = block.AddonUUID || config.AddonUUID
            block.DrawURL = block.DrawURL || DrawGridDefaultURL
        })
        const relationGroups = groupRelationBlocks(blocks as RelationBlock[])
        const gridArray = await this.drawLists(relationGroups, blocks, searchResult, resource)

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

    private async drawLists(relationBlocks: RelationBlock[], viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult, resource: string){
        return Promise.all(relationBlocks.map(async relationBlock => {
            return await this.drawList(relationBlock, viewBlocks, searchResult, resource)
        }))
    }

    private async drawList(block: RelationBlock, viewBlocks: ViewBlock[], searchResult: AddonsDataSearchResult, resource: string): Promise<DataRow[]>{
        const result =  await pepperi.addons.api.uuid(block.AddonUUID).post({
            url: block.DrawURL,
            body: { Data: searchResult.Objects , ViewBlocks: viewBlocks, Resource: resource }
        })

        if(!result.Data){
            throw new Error(`can't draw  view blocks for adddon uuid ${block.AddonUUID} and url ${block.DrawURL}`)
        }
        return result.Data
    }

}