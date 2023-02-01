export interface MenuConfiguration{
    Blocks: MenuBlock[];
}
export interface LineMenuConfiguration{
    Blocks: LineMenuBlock[]
}

export interface MenuBlock{
    Key: string;
    Title: string;
    Button?: Button
}

export interface LineMenuBlock{
    Key: string,
    Title: string
}

export interface Button {
    Key: string;
    Value?: string;
    ClassNames?: string;
    Disabled?: boolean;
    IconName?: string;
    IconPosition?: 'start' | 'end';
    StyleType?: StyleType
}

type StyleType = 'weak' | 'weak-invert' | 'regular' | 'strong';