import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { BlockComponent } from './index';
import { config } from '../addon.config';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
// import { PepDIMXModule } from '@pepperi-addons/ngx-composite-lib/dimx-export';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { PepGenericFormModule } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { FieldEditorModule } from '../field-editor/field-editor.module'
import { UtilitiesService } from '../services/utilities-service';
import { GenericResourceService } from '../services/generic-resource-service';
import { DataViewService } from '../services/data-view-service';
import { ViewsService } from '../services/views.service';

export const routes: Routes = [
    {
        path: '',
        component: BlockComponent
    }
];

@NgModule({
    declarations: [BlockComponent],
    imports: [
        CommonModule,
        PepGenericListModule,
        PepNgxCompositeLibModule,
        PepMenuModule,
        PepButtonModule,
        PepSelectModule,
        PepPageLayoutModule,
        PepSizeDetectorModule,
        PepGenericFormModule,
        FieldEditorModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [BlockComponent],
    providers: [
        TranslateStore,
        // When loading this module from route we need to add this here (because only this module is loading).
        UtilitiesService,
        GenericResourceService,
        DataViewService,
        ViewsService,
    ]
})
export class BlockModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
