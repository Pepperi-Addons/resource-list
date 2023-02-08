export interface View {
    Key: string;
    Type: "Grid" | "Cards";
    Title: string;
    Blocks: ViewBlock[]
}

export interface ViewBlock{
    Title: string;
    Group: string //used to group related blocks
    Configuration: any;
    AddonUUID: string //the addon that exposing the draw function
    DrawDataURL: string //the relative url that define in this relation to draw that block
}

interface GridView extends View{
    Type: "Grid";
    Blocks: ViewBlock[];
}

interface CardsView extends View{
    Type: "Cards";
    Blocks: ViewBlock[];
}