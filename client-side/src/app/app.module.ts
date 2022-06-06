import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BlockModule } from './block/block.module';
import { BlockEditorModule } from './block-editor/block-editor.module';
import { DraggableCardFieldsModule } from './draggable-card-fields/draggable-card-fields.module';
import { DataConfigurationBlockModule } from './data-configuration-block';
import { DataConfigurationBlockEditorModule } from './data-configuration-block-editor';
import { ViewsAndEditorsModule } from './views-and-editors'
import { TranslateLoader, TranslateModule, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { AppRoutingModule } from './app.route';
import { ViewsEditorComponent } from './views-editor/views-editor.component'
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { MatTabsModule } from '@angular/material/tabs';
import { PepGenericFormModule } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorsEditorComponent } from './editors-editor/editors-editor.component';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';

@NgModule({
    imports: [
        BrowserModule,
        BlockModule,
        BlockEditorModule,
        DraggableCardFieldsModule,
        DataConfigurationBlockModule,
        DataConfigurationBlockEditorModule,
        ViewsAndEditorsModule,
        AppRoutingModule,
        PepButtonModule,
        MatTabsModule,
        PepGenericFormModule,
        BrowserAnimationsModule,
        PepSelectModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: PepAddonService.createMultiTranslateLoader,
                deps: [PepAddonService]
            }
        })
    ],
    declarations: [
        AppComponent,
        ViewsEditorComponent,
        EditorsEditorComponent,
    ],
    providers: [
        TranslateStore
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
