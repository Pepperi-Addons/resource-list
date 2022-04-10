import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { SelectOption } from '../../../../shared/entities'

@Component({
    selector: 'data-configuration-block-editor',
    templateUrl: './data-configuration-block-editor.component.html',
    styleUrls: ['./data-configuration-block-editor.component.scss']
})

export class DataConfigurationBlockEditorComponent implements OnInit {
    @Input() hostObject: any;
    currentResourceName: string
    resourcesNames: SelectOption[] = []
    resources: any[] = [];
    currentEditMode: string
    editModeOptions : SelectOption[] = []

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService, private udcService: UDCService){
        this.udcService.pluginUUID = config.AddonUUID
    }

    ngOnInit(): void {
        this.editModeOptions = [{'key': 'readOnly', 'value': this.translate.instant('Read Only')}, {'key': 'modifiable', 'value': this.translate.instant('Modifiable')}]
        this.loadVariablesFromHostObject();
        this.initResources()
    }
    loadVariablesFromHostObject(){
        this.currentResourceName = this.hostObject?.resorceName;
        this.resourcesNames = this.hostObject.resorceNames || [];
        this.currentEditMode = this.hostObject.currentEditMode || this.editModeOptions[0].key;
    }
    async initResources(){
        const resources = await this.udcService.getCollections()
        this.resources = resources;
        this.resourcesNames = resources.map(resource => {
            return {'key': resource.Name, 'value': resource.Name}})
        if(this.resourcesNames.length > 0 && !this.currentResourceName){
            this.currentResourceName = this.resourcesNames[0].value
        }
    }
    onResourceChanged($event){
        this.currentResourceName = $event
    }
    onEditModeChanged($event){
        this.currentEditMode = $event
    }
}