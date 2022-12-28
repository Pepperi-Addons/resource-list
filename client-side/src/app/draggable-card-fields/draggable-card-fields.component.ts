import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {ICardEditor, MappedVariable, ViewsCard } from './cards.model';
import { View } from 'shared';
import { ViewsService } from '../services/views.service';
import { UtilitiesService } from '../services/utilities-service';


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
                private viewService: ViewsService,
                private utilitiesService: UtilitiesService) {
        
    }
    ngOnInit(): void {
        this.init()
    }
    async init(){
        try{
            this.loadCompleted = false;
            [this.view] = await this.viewService.getItems(this.card.selectedView.key)
            this.loadCompleted = true
        }
        catch(err){
             this.utilitiesService.showDialog('error', 'NoViewExistMsg', 'close')
        }
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
    onMappedVariablesArrayChanged(mappedVariablesArray: MappedVariable[]){
        this.card.mappedVariables = mappedVariablesArray
        this.updateCard.emit(this.card)
    }
}
