export interface MenuConfiguration{
    Blocks: MenuBlock[];
}

export interface LineMenuConfiguration{
    Blocks: LineMenuBlock[]
}

export interface MenuBlock{
    Key: string;
    Title: string;
    Disabled?: boolean;
    ButtonStyleType?: StyleType
}

export interface LineMenuBlock{
    Key: string,
    Title: string
}


type StyleType = 'weak' | 'weak-invert' | 'regular' | 'strong';