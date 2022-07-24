import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldEditorComponent } from './field-editor.component';
import { PepGenericFormModule } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { RouterModule, Routes } from '@angular/router';


export const routes: Routes = [
  {
      path: '',
      component: FieldEditorComponent
  }
];

@NgModule({
  declarations: [
    FieldEditorComponent
  ],
  imports: [
    CommonModule,
    PepGenericFormModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: PepAddonService.createMultiTranslateLoader,
          deps: [PepAddonService]
      }, isolate: false
    }),
    RouterModule.forChild(routes)
  ],
  exports: [FieldEditorComponent]
})
export class FieldEditorModule { }
