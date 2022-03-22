import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { MatTabsModule } from '@angular/material/tabs';
import { BlockEditorComponent } from './index';
import { config } from '../addon.config';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { BlockEditorService } from './block-editor.service';

@NgModule({
    declarations: [BlockEditorComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        PepSelectModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(addonService, ['ngx-lib', 'ngx-composite-lib'], config.AddonUUID),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [BlockEditorComponent],
    providers: [
        TranslateStore,
        BlockEditorService,
        TranslateService
        // Add here all used services.
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
