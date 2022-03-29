import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IContent } from './cards.model';

@Component({
  selector: 'draggable-card-fields',
  templateUrl: './draggable-card-fields.component.html',
  styleUrls: ['./draggable-card-fields.component.scss']
})

export class DraggableCardFieldsComponent implements OnInit {
  @Input() id: string;
  public title: string;
  showContentOfField = false;
  @Input() showActions = true;
  constructor(
    private translate: TranslateService,
) { 
}
async ngOnInit(): Promise<void> {
    const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();
}
onRemoveClick() {
    //todo
}
onEditClick() {
    this.showContentOfField = !this.showContentOfField
}
onCardFieldChange(key, event){
    const value = key.indexOf('image') > -1 && key.indexOf('src') > -1 ? event.fileStr :  event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
    if(key.indexOf('.') > -1){
        let keyObj = key.split('.');0
    }
}
}
