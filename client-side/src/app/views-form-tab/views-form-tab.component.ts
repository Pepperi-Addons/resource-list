import { Component, Input, OnInit } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { BaseDataView, DataViewType, GridDataViewField } from '@pepperi-addons/papi-sdk';
import { AbstractProfileCardsTabComponent } from '../abstract-profile-cards-tab/abstract-profile-cards-tab.component';
import { IDataViewField, IMappedField, IViewMappedField } from '../metadata';
import { DataViewService } from '../services/data-view-service';
import { GenericResourceService } from '../services/generic-resource-service';
import { ProfileService } from '../services/profile-service';
import { UtilitiesService } from '../services/utilities-service';

@Component({
  selector: 'app-views-form-tab',
  templateUrl: './views-form-tab.component.html',
  styleUrls: ['./views-form-tab.component.scss']
})

export class ViewsFormTabComponent extends AbstractProfileCardsTabComponent implements OnInit {
  @Input() resourceName: string
  constructor(private genericResource: GenericResourceService,
    protected dataViewService: DataViewService,
    protected profileService: ProfileService,
    protected utilitiesService: UtilitiesService){
      super(dataViewService, profileService, utilitiesService);
  }
  ngOnInit(): void {
    this.init()
  }
  setDataViewContextName(): void {
    this.dataViewContextName = `GV_${this.key}_View`
  }
  async getFields(){
    return await this.genericResource.getResourceFieldsIncludeReferenceFields(this.resourceName)    
  }
  mappedFieldToDataViewField(mappedField: IMappedField, index: number): IDataViewField{
    return {
      FieldID: mappedField.field.FieldID,
      Title: mappedField.field.Title,
      ReadOnly: mappedField.field.ReadOnly,
      Mandatory: mappedField.field.Mandatory,
      Type: mappedField.field.Type,
      Style: {
        Alignment: {
          Vertical: "Center",
          Horizontal: "Stretch"
        }
      },
      Layout: {
        Origin: {
          X: index,
          Y: 0
        }
      }
    }
  }
  fieldToMappedField(field: GridDataViewField, width = 10): IViewMappedField{
    return {
      field: field,
      width: width
    }
  }
  draggableFieldToMappedField(draggableItem: IPepDraggableItem){
    return {
     field: {
       FieldID: draggableItem.data.FieldID,
       Title: draggableItem.data.Title, 
       Mandatory: draggableItem.data.Mandatory,
       ReadOnly: draggableItem.data.ReadOnly,
       Type: draggableItem.data.Type,
     },
     width: 10
    };
 }

 getDefaultDataView(): BaseDataView {
  return {
    Type: 'Grid',
    Context: {
      Name: this.dataViewContextName,
      Profile: {
      },
      ScreenSize: 'Tablet'
    }
  };
}
}
