interface View {
    Key: string;
    Type: "Grid" | "Cards";
    Title: string;
}

interface ViewBlock{
    Title: string;
    Group: string //used to group related blocks
    Configuration: any;
}

interface GridView extends View{
    Type: "Grid";
    Blocks: ViewBlock[];
}

interface Cardsview extends View{
    Type: "Cards";
    Blocks: ViewBlock[];
}