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



export const routes: Routes = [
  {
      path: '',
      component: ViewsAndEditorsComponent
  }
];

@NgModule({
  declarations: [
    ViewsAndEditorsComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    PepGenericListModule,
    PepButtonModule,
    BrowserAnimationsModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: PepAddonService.createMultiTranslateLoader,
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
