import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { BaseFormDataViewField, DataViewField, DataViewFieldTypes, FormDataView } from '@pepperi-addons/papi-sdk';
import { UtilitiesService } from 'src/app/services/utilities-service';

@Component({
  selector: 'input-variables-add-form',
  templateUrl: './input-variables-add-form.component.html',
  styleUrls: ['./input-variables-add-form.component.scss']
})
export class InputVariablesAddFormComponent implements OnInit {
  dataSource: any = {}
  dataView: FormDataView
  isValid = false
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public incoming: any,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<InputVariablesAddFormComponent>,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {

    this.loadComponent()
  }

  loadComponent(){
    this.dataView = this.getDataView()
    this.dataSource = this.incoming.dataSource
  }

  
  getDataView(): FormDataView{
    return {
      Type: "Form",
      Fields: this.getDataViewFields(),
      Context: {
        Name: "",
        Profile: {},
        ScreenSize: 'Tablet'
      }
    }
  }


  getDataViewFields(): any[]{
      return [
        {
          FieldID: 'Name',
          Type: 'TextBox',
          Mandatory: true,
          ReadOnly: false,
          Title: this.translate.instant('Name')
        },
        {
          FieldID: 'Type',
          Type: 'ComboBox',
          OptionalValues: this.getTypeOptions(),
          Mandatory: true,
          ReadOnly: false,
          Title: this.translate.instant('Type')
        }
      ]
  }

  getTypeOptions(){
    return [
      {
        Key: "Boolean",
        Value: "Boolean"
      },
      {
        Key: "Date",
        Value: "Date"
      },
      {
        Key: "Number",
        Value: "Number"
      },
      {
        Key: "String",
        Value: "String"
      }
    ]
  }

  onCancel(){
    this.dialogRef.close()
  } 

  onSave(){
    if(this.incoming.alreadyTakenNames.find(name => this.dataSource.Name == name)){
      this.utilitiesService.showDialog('Error', 'NameAlreadyTaken', 'close')
    }
    else{
      this.dialogRef.close(this.dataSource)
    }
  }



}

