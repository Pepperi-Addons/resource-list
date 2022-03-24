import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockEditorService } from './block-editor.service'

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    resourcesNames:  {key:string, value:string}[] = []
    resources: any[] = []
    resource: any
    title: string
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private blockEditorService: BlockEditorService
               ) {
    }

    ngOnInit(): void {
        this.blockEditorService.pluginUUID = "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
        this.resource = this.hostObject?.configuration?.resource
        this.title = this.hostObject?.configuration?.title
        this.blockEditorService.getCollections().then(resources => {
            this.resources = resources;
            this.resourcesNames = resources.map(resource => {
                return {key: resource.Name, value: resource.Name}})
        })
    }
    onTitleChanged($event):void{
        this.title = $event;
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration : {
                resource: this.resource,
                title: $event
            }
            
        })
    }
    onResourceChanged($event):void{
        this.resource = $event
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: {
                resource: $event,
                title: this.title
            }
        })
    }
    ngOnChanges(e: any): void {
    }
}
