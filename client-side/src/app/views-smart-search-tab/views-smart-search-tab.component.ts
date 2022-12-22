import { Component, Input, OnInit } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { MenuDataViewField, SchemeField } from '@pepperi-addons/papi-sdk';
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
    return this.indexedFields.filter(indexedField => indexedField.Type != 'String' && indexedField.Type != "DateTime").map(indexedField => {
      return {
        FieldID: indexedField.FieldID,
        Title: indexedField.FieldID
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

}
