import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockEditorService } from './block-editor.service'
import { config } from '../addon.config'
import { KeyValuePair } from '@pepperi-addons/ngx-lib';

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    resourcesNames: KeyValuePair<string>[] = []
    resources: any[] = []
    resource: any
    title: string
    allowExport: boolean = false;
    allowImport: boolean = false;
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private blockEditorService: BlockEditorService
               ) {
    }
    ngOnInit(): void {
        this.blockEditorService.pluginUUID = config.AddonUUID
        this.resource = this.hostObject?.configuration?.resource
        this.title = this.hostObject?.configuration?.title
        this.allowExport = this.hostObject?.configuration?.allowExport
        this.allowImport = this.hostObject?.configuration?.allowImport
        //phase 1 will support only UDC resources
        this.blockEditorService.getAllResources('UDC').then(resources => {
            this.resources = resources;
            this.resourcesNames = resources.map(resource => {
                const keyValuePair = new KeyValuePair<string>()
                keyValuePair.Key = resource.Name
                keyValuePair.Value = resource.Name
                return keyValuePair})
        })
    }
    onAllowExportChange($event){
        this.allowExport = $event
        this.updateConfigurationObject()
    }
    onAllowImportChange($event){
        this.allowImport = $event
        this.updateConfigurationObject()
    }
    onTitleChanged($event):void{
        this.title = $event;
        this.updateConfigurationObject()
    }
    onResourceChanged($event):void{
        this.resource = $event
        this.updateConfigurationObject()
    }
    updateConfigurationObject(){
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: {
                resource: this.resource,
                title: this.title,
                allowExport: this.allowExport,
                allowImport: this.allowImport
            }
        })

    }
}
