import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { DataSource } from 'src/app/data-source/data-source';
import { IGenericViewerDataSource } from 'src/app/generic-viewer-data-source';
import { IGenericViewerConfigurationObject } from 'src/app/metadata';
import { IGenericViewer } from '../../../../../shared/entities';
import { ListOptions } from '../generic-viewer.model';
import { SelectionListService } from './selection-list.service';

@Component({
  selector: 'selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent implements OnInit {

  @Input() genericViewer: IGenericViewer
  @Input() selectionListConfiguration: IGenericViewerConfigurationObject
  @Input() genericViewerDataSource: IGenericViewerDataSource

  @Output() pressedDoneEvent: EventEmitter<number> = new EventEmitter<number>()
  @Output() pressedCancelEvent: EventEmitter<void> = new EventEmitter<void>()

  listOptions: ListOptions
  dataSource: DataSource
  loadCompleted: boolean = false
  dialogRef = null
  dialogData = null

  constructor(
    private selectionListService: SelectionListService,
    private dialogService : PepDialogService,
    private injector: Injector,
    ) {
      this.dialogRef = this.injector.get(MatDialogRef, null)
      this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
     }

  ngOnInit(): void {
    if(this.dialogData){
      this.loadVariablesFromDialog()
    }
    this.listOptions = this.selectionListService.createListOptions(this.selectionListConfiguration)
    this.dataSource = this.selectionListService.createDataSource(this.genericViewer, this.genericViewerDataSource)
    this.loadCompleted = true
  }
  loadVariablesFromDialog(){
    this.genericViewer = this.dialogData.genericViewer
    this.selectionListConfiguration = this.dialogData.configurationObj
    this.genericViewerDataSource = this.dialogData.gvDataSource

  }

  onDoneClicked(event){
    this.pressedDoneEvent.emit(event)
    this.dialogRef?.close()
  }
  onCancelClicked(){
    this.pressedCancelEvent.emit()
    this.dialogRef?.close()
  }




}
