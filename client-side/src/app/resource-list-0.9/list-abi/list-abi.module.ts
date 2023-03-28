import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceListModule } from '../resource-list/resource-list.module';
import { ListAbiComponent } from './list-abi.component';



@NgModule({
  declarations: [
    ListAbiComponent
  ],
  imports: [
    CommonModule,
    ResourceListModule,
  ]
})
export class ListABIModule { }
