import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../../../../shared/entities';
import { DataConfigurationCard } from '../draggable-card-fields/cards.model';


@Component({
  selector: 'data-configuration-draggable-fields',
  templateUrl: './data-configuration-draggable-fields.component.html',
  styleUrls: ['./data-configuration-draggable-fields.component.scss']
})

export class DataConfigurationDraggableFieldsComponent {
    public title: string;
    // showContentOfField = false;
    keyOptions: SelectOption[] = []
    @Input() field: any
    @Input() card: DataConfigurationCard
    @Input() resourceFields: string[]
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() fieldSelected: EventEmitter<any> = new EventEmitter()
    @Output() insertWidth: EventEmitter<any> = new EventEmitter();
    @Output() saveCardsList: EventEmitter<void> = new EventEmitter();
    
    constructor(private translate: TranslateService) {
    }

    ngOnChanges(event){
      this.initKeyOptions()
    }
    initKeyOptions(): void{
      if(this.resourceFields && this.resourceFields.length > 0){
        this.keyOptions = this.resourceFields.map((field) => {return {key: field, value: field}})
      }
    }
    onRemoveClick(): void {
      this.removeClick.emit({id: this.card.id})
    }
    onEditClick(): void{
      this.card.showContent = !this.card.showContent
      this.emitSaveEvent()
    }
    onSelectKey($event):void{
      this.card.key = $event
      this.card.label = $event
      this.emitSaveEvent()
    }
    onLabelChange($event){
      this.card.label = $event
      this.emitSaveEvent()
    }
    onReadOnlyChange($event){
      this.card.readOnly = $event
      this.emitSaveEvent()
    }
    onMandatoryChange($event){
      this.card.mandatory = $event
      this.emitSaveEvent()
    }

    emitSaveEvent(){
      this.saveCardsList.emit()
    }
}
