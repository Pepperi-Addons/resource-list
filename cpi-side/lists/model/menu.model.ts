export interface Menu{
    Blocks: MenuBlock[];
}

export interface MenuBlock{
    Key: string;
    Title: string;
    Button?: Button
}


export interface Button {
    key: string;
    value?: string;
    classNames?: string;
    disabled?: boolean;
    iconName?: string;
    iconPosition?: 'start' | 'end';
    styleType?: styleType
}

type styleType = 'weak' | 'weak-invert' | 'regular' | 'strong';