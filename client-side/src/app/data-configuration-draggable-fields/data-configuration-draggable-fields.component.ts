import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICardEditor } from '../draggable-card-fields/cards.model';


@Component({
  selector: 'draggable-card-fields',
  templateUrl: './draggable-card-fields.component.html',
  styleUrls: ['./draggable-card-fields.component.scss']
})

export class DataConfigurationDraggableFieldsComponent {
    public title: string;
    showContentOfField = false;
    @Input() field: any
    @Input() items: any[]
    @Input() card: ICardEditor
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() fieldSelected: EventEmitter<any> = new EventEmitter()
    @Output() insertWidth: EventEmitter<any> = new EventEmitter();
    
    constructor(private translate: TranslateService) {
    }

    ngOnChanges(event){
      //here we cant take thing from host obj
    }
    onRemoveClick() {
      this.removeClick.emit({id: this.card.id})
      this.field = undefined
    }
    onEditClick() {
        this.showContentOfField = !this.showContentOfField
    }
}
