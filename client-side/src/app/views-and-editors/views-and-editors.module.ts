import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewsAndEditorsComponent } from './views-and-editors.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { MatTabsModule } from '@angular/material/tabs';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { TableComponent } from './table/table.component';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { config } from '../addon.config';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



export const routes: Routes = [
  {
      path: '',
      component: ViewsAndEditorsComponent
  }
];

@NgModule({
  declarations: [
    ViewsAndEditorsComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    PepGenericListModule,
    PepButtonModule,
    BrowserAnimationsModule,
    PepTopBarModule,
    PepPageLayoutModule,
    PepMenuModule,
    PepSizeDetectorModule,
    PepDialogModule,
    MatDialogModule,
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
  exports:[ViewsAndEditorsComponent],
  providers: [
      TranslateStore,
      // When loading this module from route we need to add this here (because only this module is loading).
  ],
  bootstrap: [ViewsAndEditorsComponent]
})
export class ViewsAndEditorsModule {
  constructor(
    translate: TranslateService,
    private pepAddonService: PepAddonService
    ){
      this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
