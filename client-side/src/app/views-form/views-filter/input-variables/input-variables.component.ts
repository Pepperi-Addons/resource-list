import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPepGenericListActions, IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { DataSource } from 'src/app/data-source/data-source';
import { GridDataViewField } from '@pepperi-addons/papi-sdk';
import { TranslateService } from '@ngx-translate/core';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { InputVariablesAddFormComponent } from './input-variables-add-form/input-variables-add-form.component';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { AvailableField } from 'shared';

@Component({
  selector: 'input-variables',
  templateUrl: './input-variables.component.html',
  styleUrls: ['./input-variables.component.scss']
})
export class InputVariablesComponent implements OnInit {
  @Input() availableFields: AvailableField[] = []
  @Output() availableFieldsChangeEvent: EventEmitter<AvailableField[]> = new EventEmitter<AvailableField[]>()
  dataSource: DataSource
  actions: IPepGenericListActions
  constructor(
    private translate: TranslateService,
    private dialogService: PepDialogService
  ) { }

  ngOnInit(): void {
    this.availableFields = this.availableFields || []
    this.dataSource = this.getDataSource()
    this.actions = this.getActions()
  }

  getDataSource(){
    const fields = this.getFields()
    const columns = fields.map(field => ({Width: 0}))
    return new DataSource(this.availableFields, fields, columns)
  }

  editItem(name: string){
    const item = this.dataSource.getItems().find(item => item.Name == name)
    this.openEditVariableDialog(item).afterClosed().subscribe(val => {
      const items = this.dataSource.getItems()
      const item = items.find(listItem => listItem.Name == val.Name)
      item.Name = val.Name
      item.Type = val.Type
      this.dataSource = new DataSource(items, this.dataSource.getFields(), this.dataSource.getColumns())
      this.availableFieldsChangeEvent.emit(items)
    })
  }

  onVariableNameClick(event){
    this.editItem(event.id)
  }
  getActions(){
    return {
      get: async (data: PepSelectionData) => {
        const actions = []
        if(data && data.rows.length == 1){
          actions.push({
            title: this.translate.instant('Edit'),
            handler: (selectedRow) => {
              this.editItem(selectedRow.rows[0])
            }
          },
          {
            title: this.translate.instant('Delete'),
            handler: (selectedRow) => {
              const name = selectedRow.rows[0]
              const items = this.dataSource.getItems().filter(item => item.Name != name)
              this.dataSource = new DataSource(items, this.dataSource.getFields(), this.dataSource.getColumns())
              this.availableFieldsChangeEvent.emit(items)
            }
          }

          )
        }
        return actions
      }
    }
  }
  openEditVariableDialog(item?: AvailableField){
    const formData = {
      alreadyTakenNames: this.dataSource.getItems().map(item => item.Name).filter(name => name != item?.Name),
      dataSource: item || {}
    }
    const config = this.dialogService.getDialogConfig({

    }, 'large');
    config.data = new PepDialogData({
        content: InputVariablesAddFormComponent
    })
    return this.dialogService.openDialog(InputVariablesAddFormComponent, formData, config)
  }
  onAddClick(){
    this.openEditVariableDialog().afterClosed().subscribe((value => {
      if(value){
        const items = this.dataSource.getItems()
        items.push(value)
        this.dataSource = new DataSource(items, this.dataSource.getFields(), this.dataSource.getColumns())
        this.availableFieldsChangeEvent.emit(items)
      }
    }))
  }



  getFields(): GridDataViewField[]{
    return [
      {
        FieldID: 'Name',
        Type: 'Link',
        Title: this.translate.instant('Name'),
        ReadOnly: true,
        Mandatory: true
      },
      {
        FieldID: 'Type',
        Type: 'TextBox',
        Title: this.translate.instant('Type'),
        ReadOnly: true,
        Mandatory: true
      }
    ]
  }

  getItems(){
    return this.dataSource.getItems()
  }

}
