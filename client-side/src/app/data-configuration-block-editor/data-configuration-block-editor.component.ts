import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'data-configuration-block-editor',
    templateUrl: './data-configuration-block-editor.component.html',
    styleUrls: ['./data-configuration-block-editor.component.scss']
})
export class DataConfigurationBlockEditorComponent implements OnInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(e: any): void {

    }
}