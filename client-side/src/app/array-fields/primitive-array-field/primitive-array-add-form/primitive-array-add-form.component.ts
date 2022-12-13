import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'primitive-array-add-form',
  templateUrl: './primitive-array-add-form.component.html',
  styleUrls: ['./primitive-array-add-form.component.scss']
})
export class PrimitiveArrayAddFormComponent implements OnInit {
  dataView:any
  fieldID: string
  type: string
  dataSource: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public incoming: any,
    private dialogRef: MatDialogRef<PrimitiveArrayAddFormComponent>,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.fieldID = this.incoming.FieldID
    this.type = this.incoming.Type
    this.dataSource = this.incoming.Item || {}
    this.createGenericForm()
  }
  onSaveButtonClick(){
    this.dialogRef.close(this.dataSource?.Value)
  }
  onCancelButtonClicked(){
    this.dialogRef.close()
  }
  createGenericForm(){
    
    this.dataView ={
      Type: "Form",
      Fields:[
        {
          ReadOnly: false,
          Title: this.translate.instant('Value'),
          Type: this.type,
          FieldID: "Value",
          Mandatory: true,
        }
      ],
      Context: {
        Name: "",
        Profile: {},
        ScreenSize: 'Tablet'
      }
    }
  }

}
