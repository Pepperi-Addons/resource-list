import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContainedArrayGVDataSource } from 'src/app/generic-viewer-data-source';
import { IGenericViewerConfigurationObject } from 'src/app/metadata';
import { GenericResourceOfflineService } from 'src/app/services/generic-resource-offline.service';
import { IGenericViewer, IReferenceField } from 'shared';
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
  @Input() resourceName
  @Input() originalValue: any[] = []
  @Input() event: BehaviorSubject<any>
  genericViewerConfiguration: IGenericViewerConfigurationObject
  containedViewerDataSource: ContainedArrayGVDataSource
  genericViewer: IGenericViewer
  loadCompleted: boolean = false
  title: string = ""
  constructor(private genericResourceService: GenericResourceOfflineService) { }

  ngOnInit(): void {
    this.loadGenericViewer()
  }
  async loadGenericViewer(){
    const referenceField = this.referenceFields.find(referenceField => this.configurationObject.FieldID == referenceField.FieldID)
    if(referenceField.SelectionList){
      this.genericViewer = await this.genericResourceService.getGenericView(referenceField.SelectionListKey)
      this.genericViewerConfiguration = {
        viewsList: [
          {
            key: this.genericViewer.view.Key,
            value: this.genericViewer.view.Name
          }
        ]
      }
      this.genericViewer.view.Name = this.configurationObject.Title
      this.containedViewerDataSource = new ContainedArrayGVDataSource(this.genericViewer, this.genericResourceService, this.originalValue)
      this.event.asObservable().subscribe((obj) => {
        obj['value'] = this.containedViewerDataSource.getUpdatedItems()
      })
      this.loadCompleted = true
    }
  }
}
