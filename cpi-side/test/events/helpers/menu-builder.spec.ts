import { expect } from 'chai'
import { MenuBuilder } from '../../../events/models/helpers/menu-builder'
import { defaultList, defaultState } from '../../../metadata'
import { List } from '../../../configuration/models/list.model'
import { ListState } from '../../../events/models/list-state.model'
import { ListMenuBlock } from '../../../configuration/models/menu.model'


// describe('test', () => {
//     it('to be ', function() {
//         expect(1).to.equal(1)
//     })
// })
function getDefaultListCopy(): List{
    return JSON.parse(JSON.stringify(defaultList))
}
describe('menu builder tests', () => {
    const menuBuilder = new MenuBuilder()
    describe('1. prev state undefined current state with only list key', function() {
        it('1. list with empty menu', async () => {
            const result = await menuBuilder.build(defaultList, defaultState, undefined)
            expect(result).to.eql(undefined)
        })
        it('2. add simple menu with one item to the burger menu', async function(){
            const list = getDefaultListCopy()
            const newButton: ListMenuBlock = {
                Key: "New",
                Title: "Add",
                ButtonStyleType: "strong",
                DrawURL: "addon-cpi/drawMenuBlock",
                AddonUUID: "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
            }
            list.Menu.Blocks.push(newButton)
            const result = await menuBuilder.build(list, defaultState, undefined)
            expect(result).to.eql({
                Blocks: [
                    newButton
                ]
            })
        })
    })

})
