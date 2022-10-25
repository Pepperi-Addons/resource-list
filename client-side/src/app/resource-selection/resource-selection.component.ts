import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGenericViewer } from '../../../../shared/entities';
import { IGenericViewerConfigurationObject } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';
import { UtilitiesService } from '../services/utilities-service';

@Component({
  selector: 'block-resource-selection',
  templateUrl: './resource-selection.component.html',
  styleUrls: ['./resource-selection.component.scss']
})
export class ResourceSelectionComponent implements OnInit {
  @Input() hostObject: any;
  @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
  configurationObj: IGenericViewerConfigurationObject
  loadCompleted: boolean = false
  genericViewer: IGenericViewer
  constructor(
    private genericResourceService: GenericResourceService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.createGenericViewerConfiguration().then(config => {
      this.configurationObj = config
      if(!config){
        this.utilitiesService.showDialog('Error', 'ResourcePickerErr', 'close')
      }
      this.loadCompleted = true
    })
  }

  async  createGenericViewerConfiguration(): Promise<IGenericViewerConfigurationObject>{
    const resource = this.hostObject.resource
    this.genericViewer = await this.genericResourceService.getSelectionList(this.hostObject.view, resource)
    if(!this.genericViewer){
      return undefined
    }
    const view = this.genericViewer.view
    const viewsDropDown = [{
      key: view.Key,
      value: view.Name
    }]
    return {
        resource: resource,
        viewsList: viewsDropDown,
        selectionList: {
          none: this.hostObject.allowNone,
          selection: this.hostObject.selectionMode
        }
      }
  }
  onDonePressed($event){
    this.hostEvents.emit({
      action: 'on-save',
      data: {
        selectedObjectKeys: $event
      }
    })
  }
  onCancelPressed(){
    this.hostEvents.emit({
      action: 'on-cancel',
      data: {}
    })
  }
}
