import { List } from "./models/configuration/list.model";
import { ListState } from "./models/events/list-state.model"

export const defaultList: List = {
    Key: 'first',
    Resource: 'not important',
    Menu: {
        Blocks: []
    },
    LineMenu: {
        Blocks: []
    },
    Views: [],
    Name: '',
    Search: {Fields: []},
    SmartSearch: {Fields: []},
    Sorting: {Ascending: false, FieldID: "CreationDateTime"},
    SelectionType: 'Single'
}

export const defaultState: ListState = {
    ListKey: "dummy"
}