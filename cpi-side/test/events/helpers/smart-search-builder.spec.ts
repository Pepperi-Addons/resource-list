import { expect } from "chai"
import { SmartSearchBuilder } from "../../../events/models/helpers/smart-search-builder"
import { copyObject, getDefaultListCopy } from "./test-utils"
import { defaultState } from "../../../metadata"
import { List } from "../../../configuration/models/list.model"

describe('smart search builder tests', () => {
    const smartSearchBuilder = new SmartSearchBuilder()

    describe('1. prev state undefined current state with only list key', function() {
        let list: List;
        beforeEach(() => {
            list = getDefaultListCopy()
        })
        it('1. list with empty smartSearch should return undefined',() => {
            const result = smartSearchBuilder.build(list.SmartSearch, defaultState, undefined)
            expect(result).to.eql(undefined)
        })
        it('2. list with one field in  smartSearch should return the smart search',() => {
            
            list.SmartSearch.Fields = [
                {
                    FieldID: 'name',
                    Title: 'name',
                    Type: 'String'
                }
            ]
            const expectedResult = copyObject(list.SmartSearch) 
            const result = smartSearchBuilder.build(list.SmartSearch, defaultState, undefined)
            expect(result).to.eql(expectedResult)
        })
    })
    describe('2. prev state is not undefined, should always return undefined', function(){
        let list
        beforeEach(() => {
            list = getDefaultListCopy()
        })
        it('1. with no smart search', function(){
            const result = smartSearchBuilder.build(list.SmartSearch, defaultState, defaultState)
            expect(result).to.eql(undefined)
        })
        it('2. list with one field in  smartSearch should return undefined',() => {
            
            list.SmartSearch.Fields = [
                {
                    FieldID: 'name',
                    Title: 'name',
                    Type: 'String'
                }
            ]
            const result = smartSearchBuilder.build(list.SmartSearch, defaultState, defaultState)
            expect(result).to.eql(undefined)
        })

    })
})