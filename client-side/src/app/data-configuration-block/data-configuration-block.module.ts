import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { config } from '../addon.config';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { DataConfigurationBlockComponent } from './data-configuration-block.component'
import { PepGenericFormModule } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { FieldEditorModule } from '../field-editor/field-editor.module';
import { UDCService } from '../services/udc-service';
import { UtilitiesService } from '../services/utilities-service';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DataViewService } from '../services/data-view-service';


export const routes: Routes = [
    {
        path: '',
        component: DataConfigurationBlockComponent
    }
];

@NgModule({
    declarations: [DataConfigurationBlockComponent],
    imports: [
        CommonModule,
        PepNgxCompositeLibModule,
        PepGenericFormModule,
        PepButtonModule,
        PepDialogModule,
        FieldEditorModule,
        MatDialogModule,
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
    exports: [DataConfigurationBlockComponent],
    providers: [
        TranslateStore,
        TranslateService,
        UtilitiesService,
        DataViewService,
        UDCService
        
    ]
})
export class DataConfigurationBlockModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
