import { PepHorizontalAlignment, PepSizeType} from "@pepperi-addons/ngx-lib";
import { PepShadowSettings} from "@pepperi-addons/ngx-composite-lib/shadow-settings";
import { PepColorSettings } from "@pepperi-addons/ngx-composite-lib/color-settings";
import { SelectOption, View } from "shared";
export type textColor = 'system-primary' | 'dimmed' | 'invert' | 'strong';
export type verticalAlignment = 'start' | 'center' | 'end';
export type textPositionStyling = 'overlyed' | 'separated';
export type groupTitleAndDescription = 'grouped' | 'ungrouped';
export type FontWeight = 'normal' | 'bold' | 'bolder';

export interface IHostObject {
    configuration: IContent;
}

export interface IContent{
    cardsConfig: IContentEditor,
    cards: Array<ICardEditor>
}

export class IContentEditor {
    maxColumns: number = 1;
    gap: number = 0.5;
    cardHeight: number = 16;
    useText: boolean = true;
    cardTextColor: textColor = 'system-primary';
    verticalAlign: verticalAlignment  = 'center';
    horizontalAlign: PepHorizontalAlignment = 'center';
    textPosition: textPositionStyling = 'overlyed';
    useTitle: boolean = true;
    titleSize: PepSizeType = 'xl';
    titleWeight: FontWeight = 'normal';
    useDescription: boolean = true;
    groupTitleAndDescription: groupTitleAndDescription = 'ungrouped';
    descriptionSize: PepSizeType = 'sm';
    descriptionMaxNumOfLines: number = 1;
    border: PepColorSettings = new PepColorSettings();
    gradientOverlay: PepColorSettings = new PepColorSettings();
    overlay: PepColorSettings = new PepColorSettings();
    editSlideIndex: number = -1;

    dropShadow: PepShadowSettings = new PepShadowSettings();
    useRoundCorners: boolean = false;
    roundCornersSize: PepSizeType = 'md';
}

export interface ICardEditor {
    id: number;
    showContent: boolean
}
export interface ViewsCard extends ICardEditor{
    views: SelectOption[]
    title: string
    selectedView: SelectOption,
    selectedResource?: string
}
export interface DataConfigurationCard extends ICardEditor{
    key:string
    label: string
    readOnly: boolean
    mandatory: boolean
    defaultValue: string  
}