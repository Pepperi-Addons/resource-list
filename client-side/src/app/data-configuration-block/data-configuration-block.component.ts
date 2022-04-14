import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DataSource } from '../data-source/data-source';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { AddonData } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'data-configuration-block',
    templateUrl: './data-configuration-block.component.html',
    styleUrls: ['./data-configuration-block.component.scss']
})
export class DataConfigurationBlockComponent implements OnInit {
    @Input() hostObject: any;
    datasource: DataSource;
    menuItems: PepMenuItem[] = [];
    item: AddonData = {};
    dataView: any
    //needs cardslist, fields from editor

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(e: any): void {
    }
    onValueChanged($event){

    }
}