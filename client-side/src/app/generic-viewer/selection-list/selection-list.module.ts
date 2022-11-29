import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionListComponent } from './selection-list.component';
import { GenericViewerModule } from "../generic-viewer.module";



@NgModule({
    declarations: [
        SelectionListComponent
    ],
    imports: [
        CommonModule,
        GenericViewerModule,
    ],
    exports: [
        SelectionListComponent
    ]
})
export class SelectionListModule { }
