import { Component, Input, OnInit } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { BaseFormDataViewField, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { AbstractProfileCardsTabComponent } from '../abstract-profile-cards-tab/abstract-profile-cards-tab.component';
import { defaultCollectionFields, IDataViewField, IEditorMappedField, IMappedField } from '../metadata';
import { DataViewService } from '../services/data-view-service';
import { GenericResourceService } from '../services/generic-resource-service';
import { ProfileService } from '../services/profile-service';
import { UtilitiesService } from '../services/utilities-service';
import { Field } from '../../../../shared/entities'
@Component({
  selector: 'app-editors-form-tab',
  templateUrl: './editors-form-tab.component.html',
  styleUrls: ['./editors-form-tab.component.scss']
})
export class EditorsFormTabComponent extends AbstractProfileCardsTabComponent implements OnInit{
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
    this.dataViewContextName = `GV_${this.key}_Editor`
  }

  async getFields(){    
    const collection = await this.genericResource.getResource(this.resourceName)
    return  [...collection?.ListView?.Fields as Field[] || [], ...defaultCollectionFields]
  }

  fieldToEditorMappedField(field: BaseFormDataViewField): IMappedField{
    return {
      field: field,
    }
  }
  fieldToMappedField(field: BaseFormDataViewField){
    return {
      field: field,
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
    };
 }
  mappedFieldToDataViewField(mappedField: IMappedField, index: number){
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
          X: 0,
          Y: index
        },
        Size: {
          Width: 1,
          Height: 1
        }
      }
    }
  }
}
