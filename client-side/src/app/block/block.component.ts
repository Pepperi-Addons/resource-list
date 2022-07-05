import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
// import { DIMXComponent } from '@pepperi-addons/ngx-composite-lib/dimx-export';
import { UDC_UUID } from '../addon.config';
import { config } from '../addon.config'
import { ViewsCard } from '../draggable-card-fields/cards.model';
import { GridDataView, GridDataViewColumn } from '@pepperi-addons/papi-sdk';
import { DataSource } from '../data-source/data-source'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { Params, Router } from '@angular/router';
import { SelectOption } from '../../../../shared/entities';
import { DataViewService } from '../services/data-view-service';

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    // @ViewChild('dimx') dimx:DIMXComponent | undefined;
    @Input() hostObject: any;
    datasource: DataSource
    resourceName: string
    title: string
    udcUUID: string = UDC_UUID
    menuItems: PepMenuItem[] = []
    allowExport: boolean = false;
    allowImport: boolean = false;
    menuDisabled: boolean = false;
    widthArray: GridDataViewColumn[] = []
    viewsList: ViewsCard[] = []
    fields: any[] = []
    items: any[] = []
    actions: any = {}
    minHeight: number
    relativeHeight: number
    allowEdit:boolean = false;

    //new page block
    dropDownOfViews: SelectOption[] = []
    currentViewKey : string
    resource: string   

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
         private udcService: UDCService,
         private router: Router,
         private dataViewService: DataViewService) {
          this.udcService.pluginUUID = config.AddonUUID
          // this.actions.get = this.getActionsCallBack()
    }
    ngOnInit(): void {
      this.loadBlock()
    }

    loadBlock(){
      this.viewsList = this.hostObject?.configuration?.viewsList || []
      this.resource = this.hostObject.configuration?.resource || ""
      this.createDropDownOfViews()
      this.currentViewKey = this.dropDownOfViews?.length > 0? this.dropDownOfViews[0].key : ""
      this.DisplayViewInList(this.currentViewKey)
    }
    async DisplayViewInList(viewKey){
      const dataViews = await this.dataViewService.getDataViewsByProfile(`GV_${viewKey}_View`, "Rep");
      if(dataViews.length > 0){
        this.loadList(dataViews[0] as GridDataView)
      }
      //if there is no dataview we will display an empty list
      else{
        this.datasource = new DataSource([],[],[])
      }
    }
    onViewChange($event){
      this.currentViewKey = $event
      this.DisplayViewInList(this.currentViewKey)

    }
    async loadList(dataView: GridDataView){
      const fields = dataView.Fields || []
      const columns = dataView.Columns || []
      const items = await this.udcService.getItems(this.resource)
      this.datasource = new DataSource(items, fields,columns)

    }

    createDropDownOfViews(){
      this.dropDownOfViews = this.viewsList.map(card => {
        return {
          key: card.selectedView.key,
          value: card.selectedView.value
        }
      })
    }

    ngOnChanges(e: any): void {
      this.loadBlock()
    }
  }