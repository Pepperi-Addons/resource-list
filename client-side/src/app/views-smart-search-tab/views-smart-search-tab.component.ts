import { Component, Input, OnInit } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { BaseDataView, DataViewType, MenuDataViewField, SchemeField } from '@pepperi-addons/papi-sdk';
import { AbstractProfileCardsTabComponent } from '../abstract-profile-cards-tab/abstract-profile-cards-tab.component';
import { IDataViewField, IMappedField, ResourceField } from '../metadata';

@Component({
  selector: 'views-smart-search-tab',
  templateUrl: './views-smart-search-tab.component.html',
  styleUrls: ['./views-smart-search-tab.component.scss']
})
export class ViewsSmartSearchTabComponent extends AbstractProfileCardsTabComponent implements OnInit {
  @Input() indexedFields: ResourceField[] = []

  setDataViewContextName(): void {
    this.dataViewContextName = `GV_${this.key}_SmartSearch`
  }
  getFields(): IDataViewField[] | Promise<IDataViewField[]> {
    const res: IDataViewField[] = [];
    this.indexedFields.forEach(indexedField => {
      res.push({
        FieldID: indexedField.FieldID,
        Title: indexedField.FieldID
      })

      if(indexedField.IndexedFields) {
        Object.keys(indexedField.IndexedFields || {}).forEach(fieldName => {
          res.push({
            FieldID: `${indexedField.FieldID}.${fieldName}`,
            Title: `${indexedField.FieldID}.${fieldName}`
          })
        })
      }
    })

    return res;
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
