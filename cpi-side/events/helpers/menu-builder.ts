 import { DrawnMenuBlock, ListMenu, ListMenuBlock } from '../../models/configuration/menu.model'
import { Menu, MenuBlock } from '../../models/events/list-layout.model'
import { ListState } from '../../models/events/list-state.model'

export class MenuBuilder{

    constructor(){}

    async build(menu: ListMenu, state: ListState | undefined, changes: Partial<ListState>): Promise<Menu | undefined>{
        const drawnBlocks = await (await this.drawBlocks(menu.Blocks, state, changes)).filter(block => block) as MenuBlock[]
        if(drawnBlocks.length == 0){
            return undefined
        }
        return  {
            Blocks: drawnBlocks
        }

    }
    private async drawBlocks(menuBlocks: ListMenuBlock[], currState: ListState | undefined, changes: Partial<ListState>): Promise<(MenuBlock | undefined)[]>{
        return await Promise.all(menuBlocks.map(async block => {
            return await this.callDrawBlockFunction(block, currState, changes)
        }))
    }
    async callDrawBlockFunction(block: ListMenuBlock, currState: ListState | undefined, changes: Partial<ListState>): Promise<MenuBlock | undefined>{
        return await pepperi.addons.api.uuid(block.AddonUUID).post({
            url: block.DrawURL,
            body: { PrevState: changes, CurrState: currState }
        })
    }


    
}