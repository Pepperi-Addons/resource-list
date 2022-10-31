import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldEditorComponent } from './field-editor.component';
import { PepGenericFormModule } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { RouterModule, Routes } from '@angular/router';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { config } from '../addon.config';
import { ArrayFieldsComponent } from '../array-fields/array-fields.component';
import { PrimitiveArrayFieldComponent } from '../array-fields/primitive-array-field/primitive-array-field.component';


export const routes: Routes = [
  {
      path: '',
      component: FieldEditorComponent
  }
];

@NgModule({
  declarations: [
    FieldEditorComponent,
    ArrayFieldsComponent,
    PrimitiveArrayFieldComponent
  ],
  imports: [
    CommonModule,
    PepGenericFormModule,
    PepButtonModule,
    PepPageLayoutModule,
    PepSizeDetectorModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (addonService: PepAddonService) => 
              PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
          deps: [PepAddonService]
      }
    }),
    RouterModule.forChild(routes)
  ],
  exports: [FieldEditorComponent]
})
export class FieldEditorModule { }
