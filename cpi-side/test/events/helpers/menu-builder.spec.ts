import { expect } from 'chai'
import { defaultList, defaultState } from '../../../metadata'
import * as sinon from "ts-sinon";
import { List } from '../../../models/configuration/list.model';
import { MenuBuilder } from '../../../events/helpers/menu-builder';
import * as mocha  from 'mocha' 
import { ListMenuBlock } from '../../../models/configuration/menu.model';


function getDefaultListCopy(): List{
    return JSON.parse(JSON.stringify(defaultList))
}

describe('menu builder tests', () => {
    const menuBuilder = new MenuBuilder()
    describe('1. prev state undefined current state with only list key', function() {
        it('1. list with empty menu', async () => {
            const result = await menuBuilder.build(defaultList.Menu, defaultState, {})
            expect(result).to.eql(undefined)
        })
        it('2. add simple menu with one item to the burger menu', async function(){
            const list = getDefaultListCopy()
            const newButton: ListMenuBlock = {
                Key: "New",
                Title: "Add",
                ButtonStyleType: "Strong",
                DrawURL: "addon-cpi/drawMenuBlock",
                AddonUUID: "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
            }
            list.Menu.Blocks.push(newButton)

            /** create stub that returns the new button and changed */
            const stubbedMenuBuilder = sinon.stubObject<MenuBuilder>(menuBuilder, ["callDrawBlockFunction"]);
            stubbedMenuBuilder.callDrawBlockFunction.returns((async () => {
                return { ...newButton, Hidden: false }
            })())

            const result = await stubbedMenuBuilder.build(list.Menu, defaultState, {})
            expect(result).to.eql({
                Blocks: [
                    {...newButton, Hidden: false }
                ]
            })
        })
    })

})
