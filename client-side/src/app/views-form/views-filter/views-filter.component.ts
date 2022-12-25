import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPepQueryBuilderField } from '@pepperi-addons/ngx-lib/query-builder';
import { AddonDataScheme } from '@pepperi-addons/papi-sdk';

import { ViewsFilterService } from './views-filter.service';
import { AvailableField, View } from 'shared';

@Component({
  selector: 'views-filter',
  templateUrl: './views-filter.component.html',
  styleUrls: ['./views-filter.component.scss']
})
export class ViewsFilterComponent implements OnInit {
  @Input() resourceFields: AddonDataScheme['Fields']
  @Input() filter : any
  @Input() availableFields: AvailableField[] = []
  fields: Array<IPepQueryBuilderField>
  variableFields: IPepQueryBuilderField[] = []
  newFilter: any
  isFormValid: boolean = true
  @Output() jsonFilterFileEvent: EventEmitter<any> = new EventEmitter<any>()
  @Output() jsonValidationEvent: EventEmitter<boolean> = new EventEmitter<boolean>()
  

  constructor(private viewsFilterService: ViewsFilterService) { }
  ngOnInit(): void {
    this.init()
    
  }
  init(){
    this.fields = this.viewsFilterService.resourceFieldsToQueryBuilderFields(this.resourceFields)
  }
  onFormValidationChanged(isFormValid: boolean){
    this.isFormValid = isFormValid
    this.jsonValidationEvent.emit(isFormValid)
  }
  onQueryChanged(event){
    this.newFilter = event
    this.jsonFilterFileEvent.emit(this.newFilter)
  }
  onAvailableFieldsChanged(event: AvailableField[]){
    this.variableFields = event.map(availableField => {
      return {
        FieldID: availableField.Name,
        Title: availableField.Name,
        FieldType: this.typeNameToPepQueryType(availableField.Type)
      }
    })
  }

   typeNameToPepQueryType(type: string){
    switch(type){
      case "String":
        return "String"
      case "Boolean":
        return "Bool"
      case "Date":
        return "DateTime"
      case "Number":
        return "Double"
    }
  }
}
