import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceSelectionComponent } from './resource-selection.component';
import { GenericViewerModule } from '../generic-viewer/generic-viewer.module';



@NgModule({
  declarations: [
    ResourceSelectionComponent
  ],
  imports: [
    CommonModule,
    GenericViewerModule
  ]
})
export class ResourceSelectionModule { }
