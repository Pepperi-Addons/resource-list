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

import { UDCService } from '../services/udc-service';
import { UtilitiesService } from '../services/utilities-service';
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
        // PepDIMXModule,
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
    exports: [BlockComponent],
    providers: [
        TranslateStore,
        // When loading this module from route we need to add this here (because only this module is loading).
        UDCService,
        UtilitiesService,
        ViewsService
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
