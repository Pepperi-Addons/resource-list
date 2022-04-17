import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DataSource } from '../data-source/data-source';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { TypeMap } from '../type-map';

@Component({
    selector: 'data-configuration-block',
    templateUrl: './data-configuration-block.component.html',
    styleUrls: ['./data-configuration-block.component.scss']
})
export class DataConfigurationBlockComponent implements OnInit {
    @Input() hostObject: any;
    datasource: DataSource;
    menuItems: PepMenuItem[] = [];
    typeMap: any;
    item: any = {'Title': "WORKS!!", 'Value': "value"};
    fields: any[] = []
    dataView =  {
        Type: "Form",
        Fields: this.fields,
        Context: {
          Name: "",
          Profile: {},
          ScreenSize: 'Tablet'
        }
      };
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService) {
      this.typeMap = new TypeMap()
      this.typeMap.init()
    }
    ngOnInit(): void {
    }
    ngOnChanges(e: any): void {
      if(this.hostObject?.configuration?.cardsList){
        this.fields = this.generateDataViewFormFields()
        this.dataView.Fields = this.fields
      }
    }
    generateDataViewFormFields(): DataView[]{
      return this.fields = this.hostObject.configuration.cardsList.map(card => {
        return {
          FieldID : card.key,
          Type: card.type,
          Title: card.label,
          ReadOnly: card.readOnly,
          Mandatory: card.mandatory,
        }
      })
    }
    onValueChanged($event){

    }
}