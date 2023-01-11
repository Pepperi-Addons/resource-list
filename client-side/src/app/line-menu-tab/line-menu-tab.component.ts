import { Component, OnInit } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import {  BaseDataView, DataViewType, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { IMappedField } from '../metadata';
import { AbstractProfileCardsTabComponent } from '../abstract-profile-cards-tab/abstract-profile-cards-tab.component';

@Component({
  selector: 'app-line-menu-tab',
  templateUrl: './line-menu-tab.component.html',
  styleUrls: ['./line-menu-tab.component.scss']
})
export class LineMenuTabComponent extends AbstractProfileCardsTabComponent  implements OnInit {

  ngOnInit(): void {
    this.init()
  }
  setDataViewContextName(): void {
    this.dataViewContextName = `RV_${this.key}_LineMenu`
  }
  getFields(){    
    return [
      {
        FieldID: "Delete",
        Title: "Delete"
      },
      {
        FieldID: "Edit",
        Title: "Edit"
      }
    ]
  }
  mappedFieldToDataViewField(mappedField: IMappedField, index: number){
    return {
      FieldID: mappedField.field.FieldID,
      Title: mappedField.field.Title
    }
  }
  fieldToMappedField(field: MenuDataViewField): IMappedField{
    return {
      field: {
        FieldID: field.FieldID,
        Title: field.Title
      }
    }
  }
  draggableFieldToMappedField(draggableItem: IPepDraggableItem){
    return {
     field: {
       FieldID: draggableItem.data.FieldID,
       Title: draggableItem.data.Title, 
     },
    };
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