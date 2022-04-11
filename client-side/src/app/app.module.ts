import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BlockModule } from './block/block.module';
import { BlockEditorModule } from './block-editor/block-editor.module';
import { DraggableCardFieldsModule } from './draggable-card-fields/draggable-card-fields.module';
import { DataConfigurationBlockModule } from './data-configuration-block/data-configuration-block.module';
import { DataConfigurationBlockEditorModule } from './data-configuration-block-editor/data-configuration-block-editor.module';

@NgModule({
    imports: [
        BrowserModule,
        BlockModule,
        BlockEditorModule,
        DraggableCardFieldsModule,
        DataConfigurationBlockModule,
        DataConfigurationBlockEditorModule

    ],
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
