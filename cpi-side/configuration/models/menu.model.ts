export interface ListMenu{
    Blocks: ListMenuBlock[];
}


export interface ListMenuBlock{
    Key: string;
    Title: string;
    ButtonStyleType?: StyleType //if exist then this is a button
    IsChangedURL: string //route to cpi side function that takes prev state and curr state and array of the menu blocks,  and determine if this menu block needs to be re rendered
    AddonUUID: string //the addon uuid who supply the rendering function
}


type StyleType = 'weak' | 'weak-invert' | 'regular' | 'strong';