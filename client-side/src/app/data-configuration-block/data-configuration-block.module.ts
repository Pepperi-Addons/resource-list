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

import { UDCService } from '../services/udc-service';
import { UtilitiesService } from '../services/utilities-service';
import { ViewsService } from '../services/views.service';

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
    exports: [DataConfigurationBlockComponent],
    providers: [
        TranslateStore,
        // When loading this module from route we need to add this here (because only this module is loading).
        UDCService,
        UtilitiesService,
        ViewsService
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
