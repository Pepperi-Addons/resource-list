export interface ListMenu{
    Blocks: ListMenuBlock[];
}


export interface ListMenuBlock{
    Key: string;
    Title: string;
    ButtonStyleType?: StyleType //if exist then this is a button
}


type StyleType = 'weak' | 'weak-invert' | 'regular' | 'strong';