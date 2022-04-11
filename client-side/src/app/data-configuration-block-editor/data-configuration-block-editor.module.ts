import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { config } from '../addon.config';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { DataConfigurationBlockEditorComponent } from './data-configuration-block-editor.component'
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DataConfigurationDraggableFieldsModule } from '../data-configuration-draggable-fields/data-configuration-draggable-fields.module';


export const routes: Routes = [
    {
        path: '',
        component: DataConfigurationBlockEditorComponent
    }
];

@NgModule({
    declarations: [DataConfigurationBlockEditorComponent],
    imports: [
        CommonModule,
        PepNgxCompositeLibModule,
        PepSelectModule,
        MatTabsModule,
        DataConfigurationDraggableFieldsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(addonService, ['ngx-lib', 'ngx-composite-lib'], config.AddonUUID),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [DataConfigurationBlockEditorComponent],
    providers: [
        TranslateStore,
        TranslateService
    ]
})
export class DataConfigurationBlockEditorModule{
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
