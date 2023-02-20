import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceListComponent } from './resource-list.component';
import { ClientEventsService } from '../services/client-events.service';
import { ListUIComponent } from './list-ui/list-ui.component';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';



@NgModule({
  declarations: [
    ResourceListComponent,
    ListUIComponent
  ],
  imports: [
    CommonModule,
    PepGenericListModule,
    PepMenuModule
  ],
  providers: [
    ClientEventsService
  ]
})
export class ResourceListModule { }
