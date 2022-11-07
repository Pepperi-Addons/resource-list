import { Component, Input, OnInit } from '@angular/core';
import { IGenericViewerConfigurationObject } from 'src/app/metadata';
import { GenericResourceService } from 'src/app/services/generic-resource-service';
import { IGenericViewer, IReferenceField } from '../../../../../shared/entities';

@Component({
  selector: 'contained-resource-array-field',
  templateUrl: './contained-resource-array-field.component.html',
  styleUrls: ['./contained-resource-array-field.component.scss']
})
export class ContainedResourceArrayFieldComponent implements OnInit {
  //inputs
  @Input() configurationObject: any
  @Input() editorDataSource: any
  @Input() referenceFields: IReferenceField[]
  genericViewerConfiguration: IGenericViewerConfigurationObject
  genericViewer: IGenericViewer
  loadCompleted: boolean = false
  title: string = ""
  constructor(private genericResourceService: GenericResourceService) { }

  ngOnInit(): void {
    this.loadGenericViewer()
  }
  async loadGenericViewer(){
    const referenceField = this.referenceFields.find(referenceField => this.configurationObject.FieldID == referenceField.FieldID )
    if(referenceField.SelectionList){
      this.genericViewer = await this.genericResourceService.getGenericView(referenceField.SelectionListKey)
      this.genericViewerConfiguration = {
        resource: this.genericViewer.view.Resource.Name,
        viewsList: [
          {
            key: this.genericViewer.view.Key,
            value: this.genericViewer.view.Name
          }
        ]
      }
      this.loadCompleted = true
    }
  }
  deepCopyInputs(){}

}
