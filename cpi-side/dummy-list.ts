import { List } from './models/configuration/list.model'

export const LIST1: List = {
    Key: "LIST_KEY",
    Name: "FirstList",
    Resource: "Friends",
    Views: [
        {
            Key: "7debbfa8-a085-11ed-a8fc-0242ac120002",
            Type: "Grid",
            Title: "FirstView",
            Blocks: [
                {
                    Title: "My name",
                    Group: "Fields",
                    Configuration: {
                        Type: "TextBox",
                        FieldID: "name",
                        Width: 10
                    },
                    DrawURL: 'addon-cpi/drawGrid',
                    AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                },
                {
                    Title: "My age",
                    Group: "Fields",
                    Configuration: {
                        Type: "NumberInteger",
                        FieldID: "age",
                        Width: 10
                    },
                    DrawURL: 'addon-cpi/drawGrid',
                    AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                },
            ],
        }
    ],
    Menu: {
        Blocks: [
            {
                Key: "New",
                Title: "Add",
                ButtonStyleType: "Strong",
                DrawURL: 'addon-cpi/drawMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
            }
        ]
    },
    LineMenu: {
        Blocks: [
            {
                Key: "delete",
                Title: "Delete",
                DrawURL: 'addon-cpi/drawLineMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
            },
            {
                Key: "edit",
                Title: "Edit",
                DrawURL: 'addon-cpi/drawLineMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
            }
        ]
    },
    Search: {
        Fields: [
            {
                FieldID: "Key"
            },
            {
                FieldID: "name"
            }
        ]
    },
    SmartSearch: {
        Fields: [
            {
                FieldID: "name",
                Title: "name",
                Type: "String"
            },
            {
                FieldID: "age",
                Title: "name",
                Type: "String"
            }
        ]
    },
    SelectionType: "Single",
    Sorting: {Ascending: false, FieldID: "name"}
}
