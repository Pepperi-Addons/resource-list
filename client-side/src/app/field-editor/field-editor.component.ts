import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UDCService } from '../services/udc-service';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.scss']
})
export class FieldEditorComponent implements OnInit {
  @Input() dataView
  @Input() dataSource
  dialogRef = null
  dialogData
  constructor(private injector: Injector, private udcService: UDCService) {
    this.dialogRef = this.injector.get(MatDialogRef, null)
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
   }

  ngOnInit(): void {
    this.dataSource = this.dataSource || this.dialogData?.item 
    this.dataView = this.dataView || this.dialogData?.editorDataView
    debugger
  }
  async onUpdateButtonClick(){
    await this.udcService.postItem(this.dialogData.resourceName, this.dataSource)
    this.dialogRef.close(true)
  }

  onCancelButtonClicked(){
    this.dialogRef.close()
  }
}
