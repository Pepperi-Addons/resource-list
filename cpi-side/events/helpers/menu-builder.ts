 import { ListMenu, Menu, MenuBlock, ListState } from "shared"
import { groupRelationBlocks } from './utils'

type drawFunctionObject = {AddonUUID: string, DrawURL: string}
export class MenuBuilder{

    constructor(){}

    async build(menu: ListMenu, state: ListState | undefined, changes: Partial<ListState>): Promise<Menu | null>{
        const drawFunctionsArray = groupRelationBlocks(menu.Blocks)
        const drawnBlocks = (await this.drawBlocks(drawFunctionsArray, state, changes)).filter(block => block).flat().map(block => {
            block!.Key = `${block?.AddonUUID}_${block?.Key}`
            return block
        }) as MenuBlock[]
        if(drawnBlocks.length == 0){
            return null
        }
        return  {
            Blocks: drawnBlocks
        }

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