import { List } from "../../../configuration/models/list.model";
import { DrawnMenuBlock, ListMenu, ListMenuBlock } from "../../../configuration/models/menu.model";
import { ListState } from "../list-state.model";

export class MenuBuilder{

    constructor(){}

    async build(list: List, currState: ListState, prevState?: ListState): Promise<ListMenu | undefined>{
        const drawnBlocks = await this.drawBlocks(list.Menu.Blocks, currState, prevState)
        const isSomethingChanged = drawnBlocks.reduce((acc, curr) => acc || curr.isChanged ,false)
        if(!isSomethingChanged){
            return undefined
        }
        return  {
            Blocks: drawnBlocks.filter(block => block.Block).map(drawnBlock => drawnBlock.Block) as ListMenuBlock[]
        }

    }
    private async drawBlocks(menuBlocks: ListMenuBlock[], currState: ListState, prevState?: ListState): Promise<DrawnMenuBlock[]>{
        return await Promise.all(menuBlocks.map(block => {
            return pepperi.addons.api.uuid(block.AddonUUID).post({
                url: block.DrawURL,
                body: {prevState: prevState, currState: currState, block: block}
            })
        }))
    }


    
}