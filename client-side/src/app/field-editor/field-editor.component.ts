import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { SelectOption, View } from '../../../../shared/entities';
import { GenericViewerComponent } from '../generic-viewer/generic-viewer.component';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';
import { UtilitiesService } from '../services/utilities-service';
import { ViewsService } from '../services/views.service';

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
     private genericResourceService: GenericResourceService,
     private utilitiesService: UtilitiesService,
     private viewsService: ViewsService,
     private dialogService: PepDialogService
     ) {
    this.dialogRef = this.injector.get(MatDialogRef, null)
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
   }

  ngOnInit(): void {
    this.dataSource = this.dataSource || this.dialogData?.item 
    this.dataView = this.dataView || this.dialogData?.editorDataView
  }
  async onUpdateButtonClick(){
    try{
      await this.genericResourceService.postItem(this.dialogData.resourceName, this.dataSource)
    }
    catch(err){
      console.log(err)
      //show dialog here
      this.dialogRef.close(false)
      this.utilitiesService.showDialog('Error', 'UpdateErrorMSG', 'close')
      return
    }
    this.dialogRef.close(true)
  }

  onCancelButtonClicked(){
    this.dialogRef.close(false)
  }
  async getResourceNameToOpen(resourceName: string, field: string): Promise<string>{
    const currentResource = await this.genericResourceService.getResource(resourceName)
    const fieldIDOfResourceToOpen = Object.keys(currentResource.Fields).find(fieldID => fieldID == field)
   return currentResource.Fields[fieldIDOfResourceToOpen].Resource
  }
  async getViewsOfResource(resourceName: string): Promise<View[]>{
    const views = await this.viewsService.getItems()
   return views.filter(view => view.Resource.Name == resourceName)
  }
  getViewsDropDown(views: View[]): SelectOption[]{
   return  views.map(view => {
      return {
        key: view.Key,
        value: view.Name
      }
    })
  }
  showReferenceDialog(resourceName: string, viewsDropDown: SelectOption[]){
    const configurationObj: IGenericViewerConfigurationObject = {
      resource: resourceName,
      viewsList: viewsDropDown,
      selectionList: {
        none: false
      }
    }
    const config = this.dialogService.getDialogConfig({

    }, 'large')
    this.dialogService.openDialog(GenericViewerComponent, configurationObj, config).afterClosed().subscribe((async isUpdatePreformed => {
      //will be implemented in the future.
     }))
  }
  async onReferenceClicked($event){
    const resourceNameToOpen = await this.getResourceNameToOpen(this.dialogData.resourceName, $event.ApiName)
    const viewsOfResourceToOpen = await this.getViewsOfResource(resourceNameToOpen)
    const viewsDropDown = this.getViewsDropDown(viewsOfResourceToOpen)
    this.showReferenceDialog(resourceNameToOpen, viewsDropDown)
  }
}
