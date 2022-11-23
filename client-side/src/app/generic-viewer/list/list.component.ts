import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GenericListComponent } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { DataSource } from 'src/app/data-source/data-source';
import { IGenericViewerConfigurationObject } from 'src/app/metadata';
import { IGenericViewer, SelectOption } from '../../../../../shared/entities';
import { ListOptions } from '../generic-viewer.model';

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

  @ViewChild(GenericListComponent) genericList;

  constructor() { }

  ngOnInit(): void {
    this.listOptions
  }

  onCancelClicked(){
    this.cancelClickedEvent.emit()
  }

  onButtonClicked(event){
    console.log(this.genericList?.getSelectedItems()?.rows || []);
    this.buttonClickedEvent.emit(this.genericList.getSelectedItems()?.rows || [])
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
