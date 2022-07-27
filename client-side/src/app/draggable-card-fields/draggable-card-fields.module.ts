import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { PepSliderModule} from '@pepperi-addons/ngx-lib/slider';
import { PepFileService, PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepImageModule } from '@pepperi-addons/ngx-lib/image';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { DraggableCardFieldsComponent } from './draggable-card-fields.component'
import { pepIconArrowDown, pepIconArrowUp, PepIconRegistry, pepIconSystemBin, pepIconSystemMove } from '@pepperi-addons/ngx-lib/icon';

const pepIcons = [
    pepIconSystemMove,
    pepIconSystemBin,
    pepIconArrowDown,
    pepIconArrowUp
];
@NgModule({
    declarations: [DraggableCardFieldsComponent],
    imports: [
        CommonModule,
        DragDropModule,
        PepButtonModule,
        PepCheckboxModule,
        PepSliderModule,
        PepNgxLibModule,
        PepSelectModule,
        PepGroupButtonsModule,
        PepImageModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient, fileService: PepFileService, addonService: PepAddonService) => 
                    PepAddonService.createDefaultMultiTranslateLoader(http, fileService, addonService),
                deps: [HttpClient, PepFileService, PepAddonService],
            }, isolate: false
        }),
    ],
    exports: [DraggableCardFieldsComponent]
})
export class DraggableCardFieldsModule { 
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService,
        private pepIconRegistry: PepIconRegistry,
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
        this.pepIconRegistry.registerIcons(pepIcons);

    }
}