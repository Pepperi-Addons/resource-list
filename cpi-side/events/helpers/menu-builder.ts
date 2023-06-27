 import { ListMenu, Menu, MenuBlock, ListState } from "shared"
import { groupRelationBlocks } from './utils'

type drawFunctionObject = {AddonUUID: string, DrawURL: string}
export class MenuBuilder{

    constructor(){}

    async build(menu: ListMenu, state: Partial<ListState> | undefined, changes: Partial<ListState>): Promise<Menu | undefined>{
        const drawFunctionsArray = groupRelationBlocks(menu.Blocks)
        const drawnBlocks = (await this.drawBlocks(drawFunctionsArray, state, changes)).filter(block => block)
        //if all the draw functions return undefined there is nothing to be rendered
        if(drawnBlocks.length == 0){
            return undefined
        }
        
        return  {
            Blocks: drawnBlocks.flat().map(block => {
                block!.Key = `${block?.AddonUUID}_${block?.Key}`
                return block
            }) as MenuBlock[]
        }

    }

    private async drawBlocks(drawURLs: drawFunctionObject[], state: Partial<ListState> | undefined, changes: Partial<ListState>): Promise<(MenuBlock[] | undefined)[]>{
        return await Promise.all(drawURLs.map(async drawURL => {
            return await this.callDrawBlockFunction(drawURL, state, changes)
        }))

    }
    async callDrawBlockFunction(drawURL: drawFunctionObject, state: Partial<ListState> | undefined, changes: Partial<ListState>): Promise<MenuBlock[] | undefined>{
        const result =  await pepperi.addons.api.uuid(drawURL.AddonUUID).post({
            url: drawURL.DrawURL,
            body: { Changes: changes, State: state }
        })
        if(!result){
            throw Error(`can't draw  menu blocks for adddon uuid ${drawURL.AddonUUID} and url ${drawURL.DrawURL}`)
        }
        return result.Result as (MenuBlock[] | undefined)
    }


    
}