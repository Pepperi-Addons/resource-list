import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceFieldsTableComponent } from './reference-fields-table.component';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { config } from '../addon.config';
import { ReferenceFieldEditDialogComponent } from './reference-field-edit-dialog/reference-field-edit-dialog.component';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { PepGenericFormModule } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';



@NgModule({
  declarations: [
    ReferenceFieldsTableComponent,
    ReferenceFieldEditDialogComponent
  ],
  imports: [
    CommonModule,
    PepGenericListModule,
    PepDialogModule,
    PepGenericFormModule,
    PepButtonModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (addonService: PepAddonService) => 
              PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
          deps: [PepAddonService]
      }
  })
  ],
  exports: [
    ReferenceFieldsTableComponent
  ]
})
export class ReferenceFieldsTableModule { }
