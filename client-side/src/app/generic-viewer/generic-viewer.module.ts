import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericViewerComponent } from './generic-viewer.component'
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { TranslateModule } from '@ngx-translate/core';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [GenericViewerComponent, ListComponent],
  imports: [
    CommonModule,
    PepGenericListModule,
    PepMenuModule,
    PepSelectModule,
    PepButtonModule,
    TranslateModule
  ],
  exports: [GenericViewerComponent]
})
export class GenericViewerModule { }
