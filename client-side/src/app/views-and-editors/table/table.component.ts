import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataSource } from '../../data-source/data-source';
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu";
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { IDataService } from '../../metadata';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { AddFormComponent } from '../../add-form/add-form.component'
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent{
  actions: IPepGenericListActions
  items: any[]
  title: string
  @Input() name: string = ""
  @Input() service: IDataService
  @Input() editRoute: string
  datasource: DataSource
  menuItems:PepMenuItem[] = []
  recycleBin: boolean = false
  fields: any[]
  listFields: any[]
  searchCB = (str, items) => {
    return items.filter(item => item.Description.includes(str) || item.Name.includes(str))
  }
  widthArray = [
    {
      Width: 0
    },
    {
      Width: 0
    },
    {
      Width: 0
    }
  ]

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: PepDialogService)
    {

    }
  ngOnInit(){
    this.listFields = this.generateListFields()
    this.title = this.translate.instant(this.name)
    this.menuItems = this.getTableMenuItems()
    this.actions = this.getTableActions()
    this.loadGenericList(false)
  }
  async loadGenericList(recycleBin: boolean){
    this.fields = await this.service.getItems(undefined, recycleBin)
    this.items = this.fieldsToListItems(this.fields)
    this.datasource = new DataSource(this.items, this.listFields, this.widthArray, this.searchCB)
  }
  fieldsToListItems(items: any[]){
    return items.map((field) => {
      return {
        Name: field?.Name,
        Description: field?.Description,
        Resource: field?.Resource?.Name,
        Key: field?.Key
      }
    })
  }
  getTableActions(){
    return {
      get: async (data: PepSelectionData) => {
        const actions: any[] = []
        if(data && data.rows.length == 1){
          actions.push({
              title: this.translate.instant('Edit'),
              handler: async (selectedRows) => {
                this.router.navigate([`${this.editRoute}${selectedRows.rows[0]}`], {relativeTo : this.route})
              }
          },
          {
            title: this.translate.instant('Delete'),
            handler: async (selectedRows) => {
              this.showDeleteDialog(selectedRows)
            }
          })
        }
        return actions
      }
    }
  }
  
  generateListFields(){
    return [{
        FieldID: 'Name',
        Mandatory: true,
        ReadOnly: true,
        Title: this.translate.instant('Name'),
        Type: 'TextBox'
      },
      {
        FieldID: 'Description',
        Mandatory: true,
        ReadOnly: true,
        Title: this.translate.instant('Description'),
        Type: 'TextBox'
      },
      {
        FieldID: 'Resource',
        Mandatory: true,
        ReadOnly: true,
        Title: this.translate.instant('Resource'),
        Type: 'TextBox'
      },
    ]
  }
  onAddClick(){
    const formData = {
      service : this.service
    }
    const config = this.dialogService.getDialogConfig({

    }, 'large');
    config.data = new PepDialogData({
        content: AddFormComponent
    })
    this.dialogService.openDialog(AddFormComponent, formData, config).afterClosed().subscribe((value => {
      this.loadGenericList(false)
    }))
  }
  menuItemClick($event){
    switch($event.source.key){
      case 'recycleBin': {
          this.initRecycleBin()
          break;
      }
      case 'backToList': {
        this.backToList()
        break
      }
    }
  }
  async backToList(){
    this.menuItems = this.getTableMenuItems()
    this.actions = this.getTableActions()
    this.title = this.translate.instant(this.name)
    this.loadGenericList(false)
  }

  getTableMenuItems(): PepMenuItem[]{
    return [
      {
        key:'recycleBin',
        text: this.translate.instant('Recycle Bin'),
        hidden: false
      }
    ]
  }
  getRecycleBinMenuItems(): PepMenuItem[]{
    return [
      {
        key:'backToList',
        text: this.translate.instant('Back To List'),
        hidden: false
      }
    ]
  }
  async initRecycleBin(){
    this.menuItems = this.getRecycleBinMenuItems()
    this.title = this.translate.instant(`${this.name} Recycle Bin`)
    this.actions = this.getRecyclebinActions()
    this.loadGenericList(true)
  }

  getRecyclebinActions(){
    return {
      get: async (data: PepSelectionData) => {
        const actions: any[] = []
        if(data && data.rows.length == 1){
          actions.push({
            title: this.translate.instant('Restore'),
            handler: async (selectedRows) => {
              const field = this.fields.find(field => field.Key == selectedRows.rows[0])
              field.Hidden = false
              await this.service.upsertItem(field)
              this.fields = await this.service.getItems(undefined, true)
              this.items = this.fieldsToListItems(this.fields)
              this.datasource = new DataSource(this.items, this.listFields, this.widthArray, this.searchCB)
            }
          })
        }
        return actions
      }
    }
  }
  showDeleteDialog(selectedRows){
    const dataMsg = new PepDialogData({
      title: this.translate.instant('Delete'),
      actionsType: 'cancel-delete',
      content: this.translate.instant("DeleteMessage")
    });
    this.dialogService.openDefaultDialog(dataMsg).afterClosed().subscribe(async (isDeletePressed) => {
      if(isDeletePressed){
        this.deleteItem(selectedRows)
      }
    })
  }
  async deleteItem(selectedRows){
    const field = this.fields.find(field => field.Key === selectedRows.rows[0])
    field.Hidden = true
    await this.service.upsertItem(field)
    this.loadGenericList(false)
  }
}
