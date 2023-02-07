import { List } from "./models/list.model";

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
                    }
                },
                {
                    Title: "My age",
                    Group: "Fields",
                    Configuration: {
                        Type: "NumberInteger",
                        FieldID: "age",
                        Width: 10
                    }
                },
            ],
        }
    ],
    Menu: {
        Blocks: [
            {
                Key: "New",
                Title: "Add",
                ButtonStyleType: "strong"
            }

        ]
    },
    LineMenu: {
        Blocks: [
            {
                Key: "delete",
                Title: "delete"
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


export function getList(key: string){
    if(LIST1.Key == "LIST_KEY"){
        return LIST1
    }
    return undefined
}