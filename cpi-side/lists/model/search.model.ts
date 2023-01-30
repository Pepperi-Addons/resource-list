interface Search{
    Fields: SearchField[];
}
interface SearchField{
    FieldID: string;
}

interface SmartSearch{
    Fields: SmartSearchFields;
}
interface SmartSearchFields{
    FieldID: string;
    Title: string;
}