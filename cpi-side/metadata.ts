import { List } from "./configuration/models/list.model";
import { ListState } from "./events/models/list-state.model";

export const defaultList: List = {
    Key: 'first',
    Resource: 'not important',
    Menu: {
        Blocks: []
    },
    LineMenu: {
        Blocks: []
    },
    Profile: 'not important',
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