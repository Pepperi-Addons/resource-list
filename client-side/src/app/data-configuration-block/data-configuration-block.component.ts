import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DataSource } from '../data-source/data-source';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { TypeMap } from '../type-map';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
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
    currentResourceName: string = ""
    minHeight: number
    relativeHeight: number
    item = {} 
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

    constructor(private translate: TranslateService, private udcService: UDCService) {
      this.udcService.pluginUUID = config.AddonUUID
      this.typeMap = new TypeMap()
      this.typeMap.init()
      
    }
    loadVariablesFromHostObject(){
      this.currentResourceName = this.hostObject?.configuration?.currentResourceName
      this.minHeight = this.hostObject?.configuration?.minHeight || 20
      this.relativeHeight = this.hostObject?.configuration?.relativeHeight || 100
    }
    ngOnInit(): void {
      debugger
      this.loadVariablesFromHostObject()
      this.loadObjectFromPageParam()
    }
    loadObjectFromPageParam(){
      const key = this.hostObject?.parameters? this.hostObject?.parameters[`collection_${this.currentResourceName}`] : undefined;
      this.updateItem(key)
    }
    ngOnChanges(e: any): void {
      if(this.hostObject?.configuration?.cardsList){
        this.rebuildDataview()
      }
      if(this.hostObject?.parameters){
        this.loadObjectFromPageParam()
      }
      if(this.hostObject?.configuration?.currentResourceName && this.hostObject?.configuration?.currentResourceName != this.currentResourceName){
        this.item = {}
        this.loadVariablesFromHostObject()
      }
    }
    rebuildDataview() : void{
      this.dataView =  {
        Type: "Form",
        Fields: this.generateDataViewFormFields(),
        Context: {
          Name: "",
          Profile: {},
          ScreenSize: 'Tablet'
        }
      };
    }
    generateDataViewFormFields(): DataView[]{
      return this.fields = this.hostObject.configuration.cardsList.map(card => card.value)
    }
    async updateItem(key: string){
      const items = await this.udcService.getItems(this.currentResourceName)
      this.item = items.find(item => item.Key == key) || {}
      this.rebuildDataview()
    }
    onSaveButtonClick(){
      this.udcService.postItem(this.currentResourceName, this.item)
    }
    onCancelClick(){
      this.item = {}
      this.rebuildDataview()
    }
}