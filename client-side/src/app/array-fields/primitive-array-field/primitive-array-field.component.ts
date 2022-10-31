
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { CastingMap } from 'src/app/casting-map';
import { DataSource } from 'src/app/data-source/data-source';
import { TypeMap } from 'src/app/type-map';
import { PrimitiveArrayAddFormComponent } from './primitive-array-add-form/primitive-array-add-form.component';

@Component({
  selector: 'primitive-array-field',
  templateUrl: './primitive-array-field.component.html',
  styleUrls: ['./primitive-array-field.component.scss']
})
export class PrimitiveArrayFieldComponent implements OnInit {
  @Input() dataViewOfArrayField: any
  @Input() editorDataSource: any
  title: string = ""
  dataSource: any = {}
  actions: IPepGenericListActions
  loadCompleted: boolean = false
  constructor(
    private translate: TranslateService,
    private dialogService: PepDialogService) { }

  ngOnInit(): void {
    const fields = this.createFieldOfList()
    const items = this.crateListDataSource()
    this.title = this.dataViewOfArrayField.Title
    this.dataSource  = new DataSource(items, fields, [{Width: 10}])
    this.actions = this.getListActions()
    this.loadCompleted = true
  }
  crateListDataSource(){
    return this.editorDataSource[this.dataViewOfArrayField.FieldID].map(val => {
      return {
        Value: val
      }
    })
    // const castingMap = new CastingMap()
    // if(this.editorDataSource && this.editorDataSource[this.dataViewOfArrayField.FieldID]){
    //   const arr = this.editorDataSource[this.dataViewOfArrayField.FieldID].split(',')
    //   return arr.map(field => {
    //     return {'Value': castingMap.cast(this.dataViewOfArrayField.Type,field)}
    //   })
    // }
    // return []
  }
  update(){
    this.editorDataSource[this.dataViewOfArrayField.FieldID] = this.dataSource.getItems().map(item => item.Value)
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
  onAddClick(){
    const typeMap = new TypeMap()
    const formData = {
      FieldID: this.dataViewOfArrayField.FieldID,
      Type: typeMap.get(this.dataViewOfArrayField.Type)
    }
    const config = this.dialogService.getDialogConfig({

    }, 'large');
    config.data = new PepDialogData({
        content: PrimitiveArrayAddFormComponent
    })
    this.dialogService.openDialog(PrimitiveArrayAddFormComponent, formData, config).afterClosed().subscribe((value => {
      if(value){
        const castingMap = new CastingMap()
        const items = this.dataSource.getItems()
        const item = {Value: castingMap.cast(this.dataViewOfArrayField.Type, value)}
        items.push(item)
        this.dataSource = new DataSource(items, this.dataSource.getFields(), this.dataSource.getColumns())
        this.update()
        console.log(`Added!!!`);
      }
    }))
  }
  getListActions(){
    return {
      get: async (data: PepSelectionData) => {
        const actions: any[] = []
        if(data && data.rows.length == 1){
          actions.push({
              title: this.translate.instant('Edit'),
              handler: async (selectedRows) => {
                console.table(`${selectedRows}`);
              }
          })
        }
        return actions
      }
    }
  }
}
