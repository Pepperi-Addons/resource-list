import { List } from "./configuration/models/list.model";

export const LIST1: List = {
    Key: "LIST_KEY",
    Name: "FirstList",
    Resource: "Friends",
    Editor: undefined,
    Profile: "some UUID",
    Views: [
        {
            Key: "7debbfa8-a085-11ed-a8fc-0242ac120002",
            Type: "Grid",
            Title: "FirstView",
            ViewBlocks: [
                {
                    Title: "My name",
                    Group: "Fields",
                    Configuration: {
                        Type: "TextBox",
                        FieldID: "name",
                        Width: 10
                    },
                    DrawDataURL: '',
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
                    DrawDataURL: '',
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
                ButtonStyleType: "strong",
                DrawURL: 'addon-cpi/drawMenuBlock',
                AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
            }
        ]
    },
    LineMenu: {
        Blocks: [
            {
                Key: "delete",
                Title: "delete",
                DrawURL: 'addon-cpi/drawMenuBlock',
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


export async function getList(key: string){
    return LIST1
}