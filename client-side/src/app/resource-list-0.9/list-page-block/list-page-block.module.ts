import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPageBlockComponent } from './list-page-block.component';
import { ClientEventsService } from '../services/client-events.service';
import { ResourceListModule } from '../resource-list/resource-list.module';



@NgModule({
  declarations: [
    ListPageBlockComponent
  ],
  imports: [
    CommonModule,
    ResourceListModule,
  ],
  providers:[
    ClientEventsService
  ]
})
export class ListPageBlockModule { }
