import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericViewerComponent } from './generic-viewer.component'
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';



@NgModule({
  declarations: [GenericViewerComponent],
  imports: [
    CommonModule,
    PepGenericListModule,
    PepMenuModule,
    PepSelectModule,
    PepButtonModule
  ],
  exports: [GenericViewerComponent]
})
export class GenericViewerModule { }
