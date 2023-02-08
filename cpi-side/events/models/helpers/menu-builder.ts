import { DrawnMenuBlock, ListMenu, ListMenuBlock } from "../../../configuration/models/menu.model";
import { ListState } from "../list-state.model";

export class MenuBuilder{

    constructor(){}

    async build(menu: ListMenu, currState: ListState, prevState?: ListState): Promise<ListMenu | undefined>{
        const drawnBlocks = await this.drawBlocks(menu.Blocks, currState, prevState)
        const isSomethingChanged = drawnBlocks.reduce((acc, curr) => acc || curr.IsChanged ,false)
        if(!isSomethingChanged){
            return undefined
        }
        return  {
            Blocks: drawnBlocks.filter(block => block.Block).map(drawnBlock => drawnBlock.Block) as ListMenuBlock[]
        }

    }
    private async drawBlocks(menuBlocks: ListMenuBlock[], currState: ListState, prevState?: ListState): Promise<DrawnMenuBlock[]>{
        return await Promise.all(menuBlocks.map(async block => {
            return await this.getDrawnBlock(block, currState, prevState)
        }))
    }
    async getDrawnBlock(block: ListMenuBlock, currState: ListState, prevState?: ListState): Promise<DrawnMenuBlock>{
        return await pepperi.addons.api.uuid(block.AddonUUID).post({
            url: block.DrawURL,
            body: {prevState: prevState, currState: currState}
        })
    }


    
}