import { Component, Input, OnInit } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { BaseDataView, DataViewType, MenuDataViewField, SchemeField } from '@pepperi-addons/papi-sdk';
import { AbstractProfileCardsTabComponent } from '../abstract-profile-cards-tab/abstract-profile-cards-tab.component';
import { IDataViewField, IMappedField, ResourceField } from '../metadata';

@Component({
  selector: 'views-search-tab',
  templateUrl: './views-search-tab.component.html',
  styleUrls: ['./views-search-tab.component.scss']
})
export class ViewsSearchTabComponent extends AbstractProfileCardsTabComponent implements OnInit {
  @Input() resourceFields: string = '';


  setDataViewContextName(): void {
    this.dataViewContextName = `GV_${this.key}_Search`
  }
  getFields(): IDataViewField[] | Promise<IDataViewField[]> {
      return Object.keys(this.resourceFields || {}).map(field => {
        return {
          FieldID: field,
          Title: field
        }
      })
  }
  mappedFieldToDataViewField(mappedField: IMappedField, index: number): IDataViewField {
    return {
      FieldID: mappedField.field.FieldID,
      Title: mappedField.field.Title,
    }
  }
  fieldToMappedField(field: MenuDataViewField): IMappedField {
    return {
      field: {
        FieldID: field.FieldID,
        Title: field.Title
      }
    }
  }
  draggableFieldToMappedField(draggableItem: IPepDraggableItem): IMappedField {
    return {
      field: {
        FieldID: draggableItem.data.FieldID,
        Title: draggableItem.data.Title, 
      },
     };
  }

  ngOnInit(): void {
    this.init()
  }
 
  getDefaultDataView(): BaseDataView {
   return {
     Type: 'Menu',
     Context: {
       Name: this.dataViewContextName,
       Profile: {
       },
       ScreenSize: 'Tablet'
     }
   };
 }
}
