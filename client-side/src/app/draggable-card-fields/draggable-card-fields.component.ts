import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICardEditor } from './cards.model';


@Component({
  selector: 'draggable-card-fields',
  templateUrl: './draggable-card-fields.component.html',
  styleUrls: ['./draggable-card-fields.component.scss']
})

export class DraggableCardFieldsComponent implements OnInit {
  public title: string;
  showContentOfField = false;
  @Input() showActions = true;
  @Input() field: any
  @Input() items: any[]
  @Input() id: number
  itemsOptions: {key: string, value:string}[]
  @Output() removeClick: EventEmitter<any> = new EventEmitter();
  @Output() selectedField: EventEmitter<any> = new EventEmitter();
  constructor(private translate: TranslateService) {} 

    async ngOnInit(): Promise<void> {
        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();
        this.setItemOptions()
    }
    setItemOptions(){
        this.itemsOptions = this.items?.map((item) => {return {key: item, value: item }})
    }
    onRemoveClick() {
    this.items = this.items.filter((item) => item != this.field)
    this.removeClick.emit({field: this.field, id: this.id})
    this.field = undefined
    }
    onEditClick() {
        this.showContentOfField = !this.showContentOfField
    }
    onSelectField($event){
        debugger
        this.field = $event
        this.selectedField.emit({field: this.field, id: this.id})
    }
    onCardFieldChange(key, event){
        const value = key.indexOf('image') > -1 && key.indexOf('src') > -1 ? event.fileStr :  event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');0
        }
    }
}
