import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericResourceService } from '../services/generic-resource-service';
import { config } from '../addon.config';
import { Editor, SelectOption } from '../../../../shared/entities'
import { EditorsService } from '../services/editors.service';

@Component({
    selector: 'data-configuration-block-editor',
    templateUrl: './data-configuration-block-editor.component.html',
    styleUrls: ['./data-configuration-block-editor.component.scss']
})

export class DataConfigurationBlockEditorComponent implements OnInit {
    @Input() hostObject: any;
    editors: Editor[] = []
    resources: any[] = []
    resourcesOptions : SelectOption[] = []
    currentResourceName: any
    editorsOptions: SelectOption[] = []
    currentEditorKey: string
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
        private genericResourceService: GenericResourceService, 
        private editorsService: EditorsService){
        this.genericResourceService.pluginUUID = config.AddonUUID
    }
    ngOnInit(): void{
        this.init()
    }
    async init(){
        this.resources = await this.genericResourceService.getResources() || []
        this.editors = await this.editorsService.getItems() || []
        this.initPepSelectResource()
        this.initPepSelectEditors()
        this.updateHostObject()
    }
    initPepSelectResource(){
        this.setResourcesOptions()
        this.currentResourceName = this.hostObject?.configuration?.currentResourceName
        this.setCurrentResourceName()
    }
    initPepSelectEditors(){
        this.setEditorsOptions(this.currentResourceName)
        this.currentEditorKey = this.hostObject?.configuration?.currentEditorKey
        this.setCurrentEditor(this.editorsOptions)
    }
    updateHostObject(){
        this.updateConfigurationField('currentResourceName', this.currentResourceName)
        this.updateConfigurationField('currentEditorKey', this.currentEditorKey)
    }
    setResourcesOptions(){
        this.resourcesOptions = this.resources.map(collection => {
            return {
                key: collection.Name,
                value: collection.Name
            }
        })
    }
    setCurrentResourceName(){
        if(this.currentResourceName == undefined || !this.isResourceExist(this.resourcesOptions, this.currentResourceName)){
            this.currentResourceName = this.resourcesOptions.length > 0? this.resourcesOptions[0].value : undefined
        }
    }
    isResourceExist(resourcesOptions: SelectOption[],resourceName: string): Boolean{
        return resourcesOptions.find(resourceOption => resourceOption.value == resourceName) != undefined
    }
    setEditorsOptions(resourceName: string){
        const resourceEditors = this.editors.filter(editor => editor.Resource.Name == resourceName)
        this.editorsOptions = resourceEditors.map(resourceEditor => {
            return {
                key: resourceEditor.Key,
                value: resourceEditor.Name 
            }
        })
    }
    setCurrentEditor(editorsOptions: SelectOption[]){
        if(this.currentEditorKey == undefined|| !this.isEditorExistInOptions(editorsOptions) ){
            this.currentEditorKey = this.editorsOptions.length > 0 ? this.editorsOptions[0].key : undefined
        }
    }
    isEditorExistInOptions(editorOptions: SelectOption[]): boolean{
        return editorOptions.find((option) => {
            return this.currentEditorKey == option.key 
        }) != undefined 
    }
    onResourceChanged($event){
        this.hostObject.configuration.currentEditorKey = undefined
        this.currentResourceName = $event
        this.initPepSelectEditors()
        this.updateHostObject()
    }
    onEditorChanged($event){
        this.currentEditorKey = $event
        this.updateHostObject()
    }
    updateConfigurationField(key: string,value: any){
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: key,
            value: value
        })
    }
}