import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { GridDataViewField } from '@pepperi-addons/papi-sdk';
import { IReferenceField, REFERENCE_TYPE } from '../../../../shared/entities';
import { DataSource } from '../data-source/data-source';
import { GenericResourceService } from '../services/generic-resource-service';
import { ReferenceFieldEditDialogComponent } from './reference-field-edit-dialog/reference-field-edit-dialog.component';

@Component({
  selector: 'block-reference-fields-table',
  templateUrl: './reference-fields-table.component.html',
  styleUrls: ['./reference-fields-table.component.scss']
})
export class ReferenceFieldsTableComponent implements OnInit {
  dataSource: DataSource
  actions: IPepGenericListActions
  @Input() resourceName: string
  @Input() referenceFields: IReferenceField[]


  constructor(
    private translate: TranslateService,
    private genericResourceService: GenericResourceService,
    private dialogService: PepDialogService) { }

  ngOnInit(): void {
    this.actions = this.getGenericListActions()
    this.loadComponent()
  }
  private getGenericListActions(): IPepGenericListActions{
    return {
      get: async (data: PepSelectionData) => {
        const actions = []
        if(data && data.rows.length == 1){
          actions.push({
            title: this.translate.instant('Edit'),
            handler: (selectedRows) => {
              this.openEditDialog(selectedRows.rows[0])
            }
          })
        }
        return actions 
      }
    }
  }
  private updateItemInList(item, newItem){
    item.SelectionList = newItem.SelectionList
    item.SelectionType = newItem.SelectionType
    item.SelectionListKey = newItem.SelectionListKey
  }
  private openEditDialog(fieldID){
    const item = this.dataSource.getItems().find(item => item.DisplayField == fieldID)
    const formData = {
      //I'm using the spread operator in order to deep copy the *non-nested* object
      item: {...item},
    }
    const config = this.dialogService.getDialogConfig({
    }, 'large');
    config.data = new PepDialogData({
        content: ReferenceFieldEditDialogComponent
    })
    this.dialogService.openDialog(ReferenceFieldEditDialogComponent, formData, config).afterClosed().subscribe((value => {
      if(value){
        this.updateItemInList(item, value)
        this.dataSource = new DataSource(this.dataSource.getItems(), this.dataSource.getFields(), this.dataSource.getColumns())

      }
    }))
  } 
  private async loadComponent(){
    const fields = this.generateListFields()
    const items = await this.generateResourceFields()
    const widthArray = Array(4).fill({Width: 10})
    this.dataSource = new DataSource(items, fields, widthArray)
  }
  private async generateResourceFields(): Promise<IReferenceField[]>{
    const resource = await this.genericResourceService.getResource(this.resourceName)
    const referenceFieldsArray = this.getReferenceFieldsArray(resource.Fields)
    this.setConfiguredReferenceFields(referenceFieldsArray)
    return referenceFieldsArray
  }
  private setConfiguredReferenceFields(listArray: IReferenceField[]): void{
    this.referenceFields?.map(referenceField => {
      const index = listArray.findIndex(field => field.DisplayField == referenceField.DisplayField)
      if(index > -1)
      listArray[index] = referenceField
    })
  }
  private getReferenceFieldsArray(resourceFields): IReferenceField[]{
    const referenceFieldsArray: IReferenceField[] = []
    Object.keys(resourceFields).forEach(fieldID => {
      if(resourceFields[fieldID].Type == REFERENCE_TYPE){
        referenceFieldsArray.push({
          FieldID: fieldID,
          DisplayField: fieldID, //temporary
          SelectionType: undefined,
          SelectionList: undefined,
          Resource: resourceFields[fieldID].Resource,
          SelectionListKey: undefined
        })
      }
    })
    return referenceFieldsArray
  }
  private generateListFields(): GridDataViewField[]{
    return [
      {
        FieldID: 'Resource',
        Type: 'TextBox',
        Title: this.translate.instant('Resource'),
        Mandatory: true,
        ReadOnly: true
      },
      {
        FieldID: 'DisplayField',
        Type: 'TextBox',
        Title: this.translate.instant('DisplayField'),
        Mandatory: true,
        ReadOnly: true
      },
      {
        FieldID: 'SelectionType',
        Type: 'TextBox',
        Title: this.translate.instant('SelectionType'),
        Mandatory: true,
        ReadOnly: true,
      },
      {
        FieldID: 'SelectionList',
        Type: 'TextBox',
        Title: this.translate.instant('SelectionList'),
        Mandatory: true,
        ReadOnly: true,
      },
    
    ]
  }
  getResourceFields(){
    return this.dataSource?.getItems() || []
  }
}
