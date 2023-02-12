 import { ListMenu, ListMenuBlock } from '../../models/configuration/menu.model'
import { Menu, MenuBlock } from '../../models/events/list-layout.model'
import { ListState } from '../../models/events/list-state.model'

export class MenuBuilder{

    constructor(){}

    async build(menu: ListMenu, state: ListState | undefined, changes: Partial<ListState>): Promise<Menu | null>{
        const drawnBlocks = (await this.drawBlocks(menu.Blocks, state, changes)).filter(block => block) as MenuBlock[]
        if(drawnBlocks.length == 0){
            return null
        }
        return  {
            Blocks: drawnBlocks
        }

    }
    private async drawBlocks(menuBlocks: ListMenuBlock[], state: ListState | undefined, changes: Partial<ListState>): Promise<(MenuBlock | null)[]>{
        return await Promise.all(menuBlocks.map(async block => {
            return await this.callDrawBlockFunction(block, state, changes)
        }))
    }
    async callDrawBlockFunction(block: ListMenuBlock, state: ListState | undefined, changes: Partial<ListState>): Promise<MenuBlock | null>{
        const result =  await pepperi.addons.api.uuid(block.AddonUUID).post({
            url: block.DrawURL,
            body: { PrevState: changes, CurrState: state }
        })
        if(!result){
            throw Error(`inside callDrawBlockFunction error occurred when trying to call draw block function of addon ${block.AddonUUID} with function url ${block.DrawURL}`)
        }
        return result.Result
    }


    
}