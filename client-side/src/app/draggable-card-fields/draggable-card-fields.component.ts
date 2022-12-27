import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {ICardEditor, ViewsCard } from './cards.model';
import { View } from 'shared';
import { ViewsService } from '../services/views.service';


@Component({
  selector: 'draggable-card-fields',
  templateUrl: './draggable-card-fields.component.html',
  styleUrls: ['./draggable-card-fields.component.scss']
})

export class DraggableCardFieldsComponent implements OnInit {
    @Input() card: ViewsCard
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() updateCard: EventEmitter<ViewsCard> = new EventEmitter()
    view: View
    loadCompleted: Boolean = false

    constructor(private translate: TranslateService,
                private viewService: ViewsService) {
        
    }
    ngOnInit(): void {
        this.init()
    }
    async init(){
        this.loadCompleted = false;
        [this.view] = await this.viewService.getItems(this.card.selectedView.key)
        this.loadCompleted = true
    }

    ngOnChanges(event){
        debugger
    }
    onRemoveClick() {
    this.removeClick.emit({id: this.card.id})
    }
    onEditClick() {
        this.card.showContent = !this.card.showContent
        this.updateCard.emit(this.card)
    }
    async updateCardsList(key){
        this.card.selectedView = this.card.views.find((view) => key === view.key)
        await this.init() 
        this.updateCard.emit(this.card)
    }
}
