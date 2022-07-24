import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { MatTabsModule } from '@angular/material/tabs';
import { BlockEditorComponent } from './index';
import { config } from '../addon.config';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { DraggableCardFieldsModule } from '../draggable-card-fields/draggable-card-fields.module';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { UDCService } from '../services/udc-service';
import { UtilitiesService } from '../services/utilities-service';
import { ViewsService } from '../services/views.service';
@NgModule({
    declarations: [BlockEditorComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        PepSelectModule,
        PepTextboxModule,
        DragDropModule,
        PepCheckboxModule,
        DraggableCardFieldsModule,
        PepButtonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [BlockEditorComponent],
    providers: [
        TranslateStore,
        // When loading this module from route we need to add this here (because only this module is loading).
        UDCService,
        UtilitiesService,
        ViewsService
    ]
})
export class BlockEditorModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
