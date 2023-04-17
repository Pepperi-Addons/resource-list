export interface ListView {
    Key: string;
    Type: ViewType
    Title: string;
    Blocks: ViewBlock[]
}
export interface ViewBlock{
    Title: string;
    Configuration: any;
    AddonUUID: string //the addon that exposing the draw function
    DrawURL: string //the relative url that define in this relation to draw that block
}
export type ViewType = "Grid" | "Cards";
