import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GenericListComponent } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { DataSource } from 'src/app/data-source/data-source';
import { IGenericViewer, SelectOption } from 'shared';
import { ListOptions } from '../generic-viewer.model';
import { debug } from 'console';

@Component({
  selector: 'view-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() dataSource: DataSource
  @Input() genericViewer: IGenericViewer
  @Input() listOptions: ListOptions
  
  @Output() viewChangedEvent: EventEmitter<string> = new EventEmitter<string>()
  @Output() menuItemClickedEvent: EventEmitter<string> = new EventEmitter<string>()
  @Output() buttonClickedEvent: EventEmitter<string[]> = new EventEmitter<string[]>()
  @Output() cancelClickedEvent: EventEmitter<void> = new EventEmitter<void>()
  @Output() fieldDrillDownEvent: EventEmitter<string> = new EventEmitter<string>()
  @ViewChild(GenericListComponent) genericList;
  constructor() { }

  ngOnInit(): void {
  }

  onFieldClicked(event){
    //event.id is the Key for the item that was clicked
    this.fieldDrillDownEvent.emit(event.id)
  }

  onButtonClicked(event){
    this.buttonClickedEvent.emit(event.source.key)
  }

  getSelectedRows(){
    return this.genericList?.getSelectedItems()?.rows || []
  }

  onViewChange(event){
    console.log(`${event}`);
    this.viewChangedEvent.emit(event)
  }

  menuItemClick(event){
    console.log(`${event}`);
    this.menuItemClickedEvent.emit(event)
  }

}
