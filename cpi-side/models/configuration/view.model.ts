export interface View {
    Key: string;
    Type: ViewType
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

export type ViewType = "Grid" | "Cards";
