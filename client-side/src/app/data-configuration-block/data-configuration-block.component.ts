import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericFormComponent, IPepGenericFormValueChange, PepGenericFormService } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { FormDataView } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'data-configuration-block',
    templateUrl: './data-configuration-block.component.html',
    styleUrls: ['./data-configuration-block.component.scss']
})
export class DataConfigurationBlockComponent implements OnInit {
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    formDataDummyList = [];
    formData = {};
    formDataView :  FormDataView = {
        Type: 'Form',
        Context: {
            Name: '',
            Profile: { },
            ScreenSize: 'Tablet'
        },
        Fields: [],
        Columns: [{}, {}],
      }

    constructor(private translate: TranslateService, private genericFormService: PepGenericFormService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(e: any): void {
    }
}