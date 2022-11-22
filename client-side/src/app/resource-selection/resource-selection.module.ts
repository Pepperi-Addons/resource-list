import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceSelectionComponent } from './resource-selection.component';
import { GenericViewerModule } from '../generic-viewer/generic-viewer.module';
import { SelectionListModule } from '../generic-viewer/selection-list/selection-list.module';



@NgModule({
  declarations: [
    ResourceSelectionComponent
  ],
  imports: [
    CommonModule,
    GenericViewerModule,
    SelectionListModule
  ]
})
export class ResourceSelectionModule { }
