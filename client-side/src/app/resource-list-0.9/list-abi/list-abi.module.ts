import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceListModule } from '../resource-list/resource-list.module';
import { ListAbiComponent } from './list-abi.component';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { config } from '../../addon.config';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';



@NgModule({
  declarations: [
    ListAbiComponent
  ],
  imports: [
    CommonModule,
    ResourceListModule,
    PepButtonModule,
    PepDialogModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (addonService: PepAddonService) => 
              PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
          deps: [PepAddonService]
      }, isolate: false
    }),
  ],
})
export class ListABIModule { }
