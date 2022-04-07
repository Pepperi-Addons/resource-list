import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { ICardEditor } from './cards.model';


@Component({
  selector: 'draggable-card-fields',
  templateUrl: './draggable-card-fields.component.html',
  styleUrls: ['./draggable-card-fields.component.scss']
})

export class DraggableCardFieldsComponent {
    public title: string;
    private eventsSubscription: Subscription;
    showContentOfField = false;
    @Input() field: any
    @Input() items: any[]
    @Input() card: ICardEditor
    width: number
    itemsOptions: {key: string, value:string}[]
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() fieldSelected: EventEmitter<any> = new EventEmitter()
    @Output() insertWidth: EventEmitter<any> = new EventEmitter();

    constructor(private translate: TranslateService) {

    }
    ngOnChanges(event){
        this.width = this.card.width
        this.field = event.field?.currentValue? event.field.currentValue : this.field
        this.items = event.items?.currentValue? event.items.currentValue : this.items
        this.title = event.title?.currentValue? event.title.currentValue : this.title
        this.card = event.card?.currentValue? event.card.currentValue : this.card
        if(event.items?.currentValue){
            this.setItemOptions()
        }
    }
    setItemOptions(){
        this.itemsOptions = this.items?.map((item) => {return {key: item, value: item}})
    }
    onRemoveClick() {
    this.removeClick.emit({id: this.card.id})
    this.field = undefined
    }
    onEditClick() {
        this.showContentOfField = !this.showContentOfField
    }
    onWidthChange($event){
        const width = Number($event)
        if(width < 0 || width > 100){
            return
        }
        this.card.width = width
        this.width = width
        this.insertWidth.emit()
    }
    onSelectField($event){
        this.field = $event
        this.card.name = this.field
        this.fieldSelected.emit({card: this.card})
    }
}
