import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPepQueryBuilderField } from '@pepperi-addons/ngx-lib/query-builder';
import { AddonDataScheme } from '@pepperi-addons/papi-sdk';

import { ViewsFilterService } from './views-filter.service';

@Component({
  selector: 'views-filter',
  templateUrl: './views-filter.component.html',
  styleUrls: ['./views-filter.component.scss']
})
export class ViewsFilterComponent implements OnInit {
  @Input() resourceFields: AddonDataScheme['Fields']
  @Input() filter : any
  fields: Array<IPepQueryBuilderField>
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
}
