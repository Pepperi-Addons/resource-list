import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PepDialogActionsType, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
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
  constructor(private injector: Injector,
     private udcService: UDCService,
     private translate: TranslateService,
     private dialogService: PepDialogService
     ) {
    this.dialogRef = this.injector.get(MatDialogRef, null)
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
    
   }

  ngOnInit(): void {
    this.dataSource = this.dataSource || this.dialogData?.item 
    this.dataView = this.dataView || this.dialogData?.editorDataView
    debugger
  }
  async onUpdateButtonClick(){
    debugger
    try{
      await this.udcService.postItem(this.dialogData.resourceName, this.dataSource)
    }
    catch(err){
      console.log(err)
      //show dialog here
      this.dialogRef.close(false)
      this.showDialog('Error', 'UpdateErrorMSG', 'close')
      return
    }
    this.dialogRef.close(true)
  }

  onCancelButtonClicked(){
    this.dialogRef.close()
  }
  
  showDialog(title: string, content: string, actionsType: PepDialogActionsType){
    const dataMsg = new PepDialogData({
      title: this.translate.instant(title),
      actionsType: actionsType,
      content: this.translate.instant(content)
    });
    this.dialogService.openDefaultDialog(dataMsg)
  }

  
  
}
