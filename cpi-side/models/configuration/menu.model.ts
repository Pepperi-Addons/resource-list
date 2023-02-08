export interface ListMenu{
    Blocks: ListMenuBlock[];
}


export interface ListMenuBlock{
    Key: string;
    Title: string;
    ButtonStyleType?: StyleType //if exist then this is a button and draw the block
    AddonUUID: string //the addon uuid who supply the rendering function
}


type StyleType = 'Weak' | 'WeakInvert' | 'Regular' | 'Strong';