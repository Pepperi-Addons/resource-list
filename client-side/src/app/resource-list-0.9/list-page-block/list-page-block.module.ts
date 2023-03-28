import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPageBlockComponent } from './list-page-block.component';
import { ClientEventsService } from '../services/client-events.service';
import { ResourceListModule } from '../resource-list/resource-list.module';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';



@NgModule({
  declarations: [
    ListPageBlockComponent
  ],
  imports: [
    CommonModule,
    ResourceListModule,
    PepButtonModule
  ],
  providers:[
    ClientEventsService
  ]
})
export class ListPageBlockModule { }
