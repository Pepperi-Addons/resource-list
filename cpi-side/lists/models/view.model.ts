interface View {
    Key: string;
    Type: "Grid" | "Cards";
    Title: string;
    ViewBlocks: ViewBlock[]
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

interface CardsView extends View{
    Type: "Cards";
    Blocks: ViewBlock[];
}