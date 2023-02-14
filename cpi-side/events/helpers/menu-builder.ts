 import { ListMenu, ListMenuBlock } from '../../models/configuration/menu.model'
import { Menu, MenuBlock } from '../../models/events/list-layout.model'
import { ListState } from '../../models/events/list-state.model'
import { groupRelationBlocks } from './utils'

type drawFunctionObject = {AddonUUID: string, DrawURL: string}
export class MenuBuilder{

    constructor(){}

    async build(menu: ListMenu, state: ListState | undefined, changes: Partial<ListState>): Promise<Menu | null>{
        const drawFunctionsArray = groupRelationBlocks(menu.Blocks)
        const drawnBlocks = (await this.drawBlocks(drawFunctionsArray, state, changes)).filter(block => block).flat() as MenuBlock[]
        if(drawnBlocks.length == 0){
            return null
        }
        return  {
            Blocks: drawnBlocks
        }

    }
    /**
     * this function optimize the number of calls to draw blocks, by grouping all the blocks that has the same relation
     * the relation is one to one map with combining the addonUUID and the drawURL
     * @param menuBlocks 
     * @returns array of object that will tell where to call in order to draw the blocks
     */
    private getDrawFunctionsArray(menuBlocks: ListMenuBlock[]): drawFunctionObject[]{
        const drawFunctionsArray: drawFunctionObject[] = []
        const visitedDrawURLs = new Set<string>()
        menuBlocks.forEach(block => {
            const key = `${block.AddonUUID}_${block.DrawURL}`
            if(!visitedDrawURLs.has(key)){
                visitedDrawURLs.add(key)
                drawFunctionsArray.push({
                    AddonUUID: block.AddonUUID,
                    DrawURL: block.DrawURL
                })
            }
        })
        return drawFunctionsArray
    }

    private async drawBlocks(drawURLs: drawFunctionObject[], state: ListState | undefined, changes: Partial<ListState>): Promise<(MenuBlock[] | undefined)[]>{
        return await Promise.all(drawURLs.map(async drawURL => {
            return await this.callDrawBlockFunction(drawURL, state, changes)
        }))
    }
    async callDrawBlockFunction(drawURL: drawFunctionObject, state: ListState | undefined, changes: Partial<ListState>): Promise<MenuBlock[] | undefined>{
        const result =  await pepperi.addons.api.uuid(drawURL.AddonUUID).post({
            url: drawURL.DrawURL,
            body: { Changes: changes, State: state }
        })
        if(!result){
            throw Error(`inside callDrawBlockFunction error occurred when trying to call draw block function of addon ${drawURL.AddonUUID} with function url ${drawURL.DrawURL}`)
        }
        return result.Result as (MenuBlock[] | undefined)
    }


    
}