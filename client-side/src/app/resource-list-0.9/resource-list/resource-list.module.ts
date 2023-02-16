import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceListComponent } from './resource-list.component';
import { ClientEventsService } from './services/client-events.service';



@NgModule({
  declarations: [
    ResourceListComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ClientEventsService
  ]
})
export class ResourceListModule { }
