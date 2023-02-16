import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BlockModule } from './block/block.module';
import { BlockEditorModule } from './block-editor/block-editor.module';
import { DraggableCardFieldsModule } from './draggable-card-fields/draggable-card-fields.module';
import { DataConfigurationBlockComponent, DataConfigurationBlockModule } from './data-configuration-block';
import { DataConfigurationBlockEditorComponent, DataConfigurationBlockEditorModule } from './data-configuration-block-editor';
import { ViewsAndEditorsModule } from './views-and-editors'
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
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
import { PepIconModule } from '@pepperi-addons/ngx-lib/icon';
import { MatIconModule } from '@angular/material/icon';
import { MenuTabComponent } from './menu-tab/menu-tab.component';
import { MenuMappedFieldComponent } from './menu-mapped-field/menu-mapped-field.component';
import { LineMenuTabComponent } from './line-menu-tab/line-menu-tab.component';
import { EditorsFormTabComponent } from './editors-form-tab/editors-form-tab.component';
import { ViewsFormTabComponent } from './views-form-tab/views-form-tab.component';
import { config } from './addon.config';
import { SettingsComponent } from './settings';
import { BlockComponent } from './block';
import { BlockEditorComponent } from './block-editor';
import { ReferenceFieldsTableModule } from './reference-fields-table/reference-fields-table.module';
import { ResourceSelectionComponent } from './resource-selection/resource-selection.component';
import { ViewsFilterComponent } from './views-form/views-filter/views-filter.component';
import { PepSmartFiltersModule } from '@pepperi-addons/ngx-lib/smart-filters';
import { PepQueryBuilderModule } from '@pepperi-addons/ngx-lib/query-builder';
import { ViewsEventsTabComponent } from './views-events-tab/views-events-tab.component';
import { ViewsSmartSearchTabComponent } from './views-smart-search-tab/views-smart-search-tab.component';
import { ViewsSearchTabComponent } from './views-search-tab/views-search-tab.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
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
        MatIconModule,
        MatIconModule,
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
        PepIconModule,
        PepIconModule,
        ReferenceFieldsTableModule,
        PepQueryBuilderModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
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
        LineMenuTabComponent,
        EditorsFormTabComponent,
        ViewsFormTabComponent,
        ViewsFilterComponent,
        ViewsEventsTabComponent,
        ViewsSearchTabComponent,
        ViewsSmartSearchTabComponent,
    ],
    providers: [
        TranslateStore
    ],
    bootstrap: [
        // AppComponent
    ]
})

export class AppModule implements DoBootstrap {
    constructor(
        private injector: Injector,
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
    
    ngDoBootstrap() {
        this.pepAddonService.defineCustomElement(`settings-element-${config.AddonUUID}`, SettingsComponent, this.injector);
        this.pepAddonService.defineCustomElement(`viewer-block-element-${config.AddonUUID}`, BlockComponent, this.injector);
        this.pepAddonService.defineCustomElement(`viewer-block-editor-element-${config.AddonUUID}`, BlockEditorComponent, this.injector);
        this.pepAddonService.defineCustomElement(`data-config-block-element-${config.AddonUUID}`, DataConfigurationBlockComponent, this.injector);
        this.pepAddonService.defineCustomElement(`data-config-block-editor-element-${config.AddonUUID}`, DataConfigurationBlockEditorComponent, this.injector);
        this.pepAddonService.defineCustomElement(`resource-selection-element-${config.AddonUUID}`, ResourceSelectionComponent, this.injector)
        this.pepAddonService.defineCustomElement(`resource-list-element-${config.AddonUUID}`, ResourceListComponent, this.injector)
    }
}