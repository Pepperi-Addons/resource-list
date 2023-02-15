export interface ListMenu{
    Blocks: ListMenuBlock[];
}


export interface ListMenuBlock{
    Key: string;
    Title: string;
    ButtonStyleType?: StyleType //if exist then this is a button
    DrawURL: string //route to cpi side function that takes prev state and curr state and draw the menu block
    AddonUUID: string //the addon uuid who supply the rendering function
}

export interface DrawnMenuBlock{
    IsChanged: boolean,
    Block: ListMenuBlock 
}


type StyleType = 'Weak' | 'WeakInvert' | 'Regular' | 'Strong';