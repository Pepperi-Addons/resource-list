import { Component, OnInit } from '@angular/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { IMappedField } from '../metadata';
import { AbstractProfileCardsTabComponent } from '../abstract-profile-cards-tab/abstract-profile-cards-tab.component'

@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss']
})
export class MenuTabComponent extends AbstractProfileCardsTabComponent implements OnInit {
  ngOnInit(): void {
    this.init()
  }
  setDataViewContextName(): void {
    this.dataViewContextName = `GV_${this.key}_Menu`
  }

  getFields(){    
    return [
      {
        FieldID: "New",
        Title: "New"
      },
      {
        FieldID: "Export",
        Title: "Export"
      },
      {
        FieldID: "Import",
        Title: "Import"
      },
      {
        FieldID: "RecycleBin",
        Title: "Recycle bin"
      },
    ]
  }
  mappedFieldToDataViewField(mappedField: IMappedField, index: number){
    return {
      FieldID: mappedField.field.FieldID,
      Title: mappedField.field.Title,
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
}
