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
import { ViewsFormComponent } from './views-form/views-form.component'
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { MatTabsModule } from '@angular/material/tabs';
import { PepGenericFormModule } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PepProfileDataViewsListModule } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { PepDraggableItemsModule } from '@pepperi-addons/ngx-lib/draggable-items';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ViewsMappedFieldComponent } from './mapped-field/views-mapped-field.component';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { AddFormComponent } from './add-form/add-form.component';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { EditorsFormComponent } from './editors-form/editors-form.component';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepSeparatorModule } from '@pepperi-addons/ngx-lib/separator';
import { EditorMappedFieldComponent } from './editor-mapped-field/editor-mapped-field.component';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { MenuTabComponent } from './menu-tab/menu-tab.component';
import { MenuMappedFieldComponent } from './menu-mapped-field/menu-mapped-field.component';

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
        PepSelectModule,
        PepProfileDataViewsListModule,
        PepPageLayoutModule,
        BrowserAnimationsModule,
        PepDraggableItemsModule,
        DragDropModule,
        PepTextboxModule,
        PepDialogModule,
        PepSelectModule,
        PepPageLayoutModule,
        PepTopBarModule,
        PepSeparatorModule,
        PepCheckboxModule,
        PepSizeDetectorModule,
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
        ViewsFormComponent,
        ViewsMappedFieldComponent,
        AddFormComponent,
        EditorsFormComponent,
        EditorMappedFieldComponent,
        MenuTabComponent,
        MenuMappedFieldComponent,
    ],
    providers: [
        TranslateStore
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
