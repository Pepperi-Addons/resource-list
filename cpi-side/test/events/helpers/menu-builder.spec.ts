import { expect } from 'chai'
import { MenuBuilder } from '../../../events/models/helpers/menu-builder'
import { defaultList, defaultState } from '../../../metadata'
import { ListMenuBlock } from '../../../configuration/models/menu.model'
import * as sinon from "ts-sinon";
import { copyObject, getDefaultListCopy } from './test-utils'




describe('menu builder tests', () => {
    const menuBuilder = new MenuBuilder()
    describe('1. prev state undefined current state with only list key', function() {
        it('1. list with empty menu', async () => {
            const result = await menuBuilder.build(defaultList.Menu, defaultState, undefined)
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
            const expectedResult = copyObject(list.Menu)

            /** create stub that returns the new button and changed */
            const stubbedMenuBuilder = sinon.stubObject<MenuBuilder>(menuBuilder, ["getDrawnBlock"]);
            stubbedMenuBuilder.getDrawnBlock.returns((async () => {
                return {
                    IsChanged: true,
                    Block: newButton
                }
            })())

            const result = await stubbedMenuBuilder.build(list.Menu, defaultState, undefined)
            expect(result).to.eql(expectedResult)
        })
    })

})
