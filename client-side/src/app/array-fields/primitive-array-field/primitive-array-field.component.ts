
import { Component, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { CastingMap } from 'src/app/casting-map';
import { DataSource } from 'src/app/data-source/data-source';
import { TypeMap } from 'src/app/type-map';
import { EventEmitter } from '@angular/core';
import { PrimitiveArrayAddFormComponent } from './primitive-array-add-form/primitive-array-add-form.component';

@Component({
  selector: 'primitive-array-field',
  templateUrl: './primitive-array-field.component.html',
  styleUrls: ['./primitive-array-field.component.scss']
})
export class PrimitiveArrayFieldComponent implements OnInit {

  //inputs: the array field to display 
  @Input() dataViewOfArrayField: any
  @Input() editorDataSource: any

  //outputs: add,edit,delete to the array
  @Output() editEvent: EventEmitter<any> = new EventEmitter<any>()
  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>()
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter<any>()

  title: string = ""
  dataSource: any = {}
  actions: IPepGenericListActions
  loadCompleted: boolean = false
  array: any[]
  
  constructor(
    private translate: TranslateService,
    private dialogService: PepDialogService) { }

  ngOnInit(): void {
    this.array = this.dataViewOfArrayField.Array
    this.createList()
    this.loadCompleted = true
  }

  createList(){
    const fields = this.createFieldOfList()
    const items = this.crateListDataSource()
    this.title = this.dataViewOfArrayField.Title
    this.dataSource  = new DataSource(items, fields, [{Width: 10}])
    this.actions = this.getListActions()
  }
  crateListDataSource(){
    return this.array.map((val, index) => {
      return {
        Value: val,
        Index: index.toString()
      }
    })
  }
  update(value: any){
    this.array.push(value)
  }
  createFieldOfList(){
    const typeMap = new TypeMap()

    return [{
      FieldID: 'Value',
      Mandatory: true,
      ReadOnly: true,
      Title: this.dataViewOfArrayField.Title,
      Type: typeMap.get(this.dataViewOfArrayField.Type)
    }]
  }
  openFormDialog(data: any, cb: (val : any) => void){
    const typeMap = new TypeMap()
    const formData = {
      FieldID: this.dataViewOfArrayField.FieldID,
      Type: typeMap.get(this.dataViewOfArrayField.Type),
      Item: data || {}
    }
    const config = this.dialogService.getDialogConfig(
      {}, 'large');
    config.data = new PepDialogData({
        content: PrimitiveArrayAddFormComponent
    })
    this.dialogService.openDialog(PrimitiveArrayAddFormComponent, formData, config).afterClosed().subscribe((value) => cb(value))
  }
  onAddClick(){
    const cb = (value) => {
      if(value){
        const castingMap = new CastingMap()
        const newItem = castingMap.cast(this.dataViewOfArrayField.Type, value)
        this.array.push(newItem)
        const newDataSource = this.crateListDataSource()
        this.dataSource = new DataSource(newDataSource, this.dataSource.getFields(), this.dataSource.getColumns())
      }
    }
    this.openFormDialog(undefined, cb)
  }
  editArrayItem(value: any, index: number){
    const castingMap = new CastingMap()
    const newItem = castingMap.cast(this.dataViewOfArrayField.Type, value)
    this.array[index] = newItem
    const newDataSource = this.crateListDataSource()
    this.dataSource = new DataSource(newDataSource, this.dataSource.getFields(), this.dataSource.getColumns())
  }
  editHandler(selectedRows: any){
    const selectedItemKey = selectedRows.rows[0]
    const items = this.dataSource.getItems()
    const item = items.find(item => item.Index == selectedItemKey)
    this.openFormDialog(item, (value => { this.editArrayItem(value, Number(item.Index))}))
  }
  deleteHandler(selectedRows: any){
    const index = Number(selectedRows.rows[0])
    this.array.splice(index, 1)
    const newDataSource = this.crateListDataSource()
    this.dataSource = new DataSource(newDataSource, this.dataSource.getFields(), this.dataSource.getColumns())
  }
  getListActions(){
    return {
      get: async (data: PepSelectionData) => {
        const actions: any[] = []
        if(data && data.rows.length == 1){
          actions.push({
              title: this.translate.instant('Edit'),
              handler: (selectedRows) => this.editHandler(selectedRows)
          },
          {
            title: this.translate.instant('Delete'),
            handler: (selectedRows) => this.deleteHandler(selectedRows)
          })
        }
        return actions
      }
    }
  }
}
