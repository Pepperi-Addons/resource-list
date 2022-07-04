import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {ICardEditor, ViewsCard } from './cards.model';


@Component({
  selector: 'draggable-card-fields',
  templateUrl: './draggable-card-fields.component.html',
  styleUrls: ['./draggable-card-fields.component.scss']
})

export class DraggableCardFieldsComponent {
    @Input() card: ViewsCard
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() updateCard: EventEmitter<ViewsCard> = new EventEmitter()

    constructor(private translate: TranslateService) {

    }
    ngOnChanges(event){
    }
    onRemoveClick() {
    this.removeClick.emit({id: this.card.id})
    }
    onEditClick() {
        this.card.showContent = !this.card.showContent
        this.updateCard.emit(this.card)
    }
    updateCardsList(key){
        this.card.view = this.card.views.find((view) => key === view.key) 
        this.updateCard.emit(this.card)
    }
}
