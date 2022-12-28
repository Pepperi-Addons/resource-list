import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvailableField, AvailableFieldType } from 'shared';
import { MappedVariable, ViewsCard } from '../cards.model';

@Component({
  selector: 'variables-mapping',
  templateUrl: './variables-mapping.component.html',
  styleUrls: ['./variables-mapping.component.scss']
})
export class VariablesMappingComponent implements OnInit {
  @Input() variablesArray: AvailableField[] = []
  @Input() card: ViewsCard
  mappedVariableArray: MappedVariable[]
  @Output() mappedVariableArrayChangedEvent: EventEmitter<MappedVariable[]> = new EventEmitter<MappedVariable[]>()

  constructor() { }

  ngOnInit(): void {
    this.mappedVariableArray = this.getMappedVariableArray(this.card.mappedVariables)
    this.mappedVariableArrayChangedEvent.emit(this.mappedVariableArray)
  }
   getMappedVariableArray(mappedVariablesArray: MappedVariable[]): MappedVariable[]{
    return this.variablesArray.map(variable => {
      const indexOfVariable = mappedVariablesArray.findIndex(mappedVariable => mappedVariable.id == variable.id)
      if(indexOfVariable < 0){
       return {
        id: variable.id,
        name: variable.Name,
        type: variable.Type,
        mappedType: 'static',
        value: this.getDefaultValueByType(variable.Type)
       }
      }
      return mappedVariablesArray[indexOfVariable]
    })
  }

getDefaultValueByType(type: AvailableFieldType){
    switch(type){
      case "Boolean":
        return false
      case "Date":
        return new Date()
      case "String":
        return ""
      case "Number":
        return 0
    }
  }
  

}
