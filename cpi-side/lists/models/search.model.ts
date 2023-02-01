import { SchemeFieldType } from "@pepperi-addons/papi-sdk";

export interface SearchConfiguration{
    Fields: SearchConfigurationField[];
}
export interface SearchConfigurationField{
    FieldID: string;
}

export interface SmartSearchConfiguration{
    Fields: SmartSearchConfigurationField[];
}
export interface SmartSearchConfigurationField{
    FieldID: string;
    Title: string;
    Type: SchemeFieldType
}