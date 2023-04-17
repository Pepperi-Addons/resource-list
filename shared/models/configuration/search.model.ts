import { SchemeFieldType } from "@pepperi-addons/papi-sdk";

export interface ListSearch{
    Fields: ListSearchField[];
}
export interface ListSearchField{
    FieldID: string;
}

export interface ListSmartSearch{
    Fields: ListSmartSearchField[];
}
export interface ListSmartSearchField{
    FieldID: string;
    Title: string;
    Type: SchemeFieldType
}