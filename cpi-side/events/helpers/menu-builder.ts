 import { DrawnMenuBlock, ListMenu, ListMenuBlock } from '../../models/configuration/menu.model'
import { ListState } from '../../models/events/list-state.model'

export class MenuBuilder{

    constructor(){}

    async build(menu: ListMenu, currState: ListState, prevState?: ListState): Promise<ListMenu | undefined>{
        const drawnBlocks = await (await this.drawBlocks(menu.Blocks, currState, prevState)).filter(block => block) as ListMenuBlock[]
        if(drawnBlocks.length == 0){
            return undefined
        }
        return  {
            Blocks: drawnBlocks
        }

    }
    private async drawBlocks(menuBlocks: ListMenuBlock[], currState: ListState, prevState?: ListState): Promise<(ListMenuBlock | undefined)[]>{
        return await Promise.all(menuBlocks.map(async block => {
            return await this.callDrawBlockFunction(block, currState, prevState)
        }))
    }
    async callDrawBlockFunction(block: ListMenuBlock, currState: ListState, prevState?: ListState): Promise<ListMenuBlock | undefined>{
        return await pepperi.addons.api.uuid(block.AddonUUID).post({
            url: block.DrawURL,
            body: { PrevState: prevState, CurrState: currState }
        })
    }


    
}