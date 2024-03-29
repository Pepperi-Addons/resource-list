import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { DataSource } from 'src/app/data-source/data-source';
import { IGenericViewerDataSource } from 'src/app/generic-viewer-data-source';
import { IGenericViewerConfigurationObject } from 'src/app/metadata';
import { IGenericViewer } from 'shared';
import { ListOptions } from '../generic-viewer.model';
import { ListComponent } from '../list/list.component';
import { ViewsListsService } from '../viewsLists.service';
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
  @Output() pressedDoneEvent: EventEmitter<string[]> = new EventEmitter<string[]>()
  @Output() pressedCancelEvent: EventEmitter<void> = new EventEmitter<void>()
  @ViewChild(ListComponent) list: ListComponent
  listOptions: ListOptions
  dataSource: DataSource
  loadCompleted: boolean = false
  dialogRef = null
  dialogData = null

  constructor(
    private selectionListService: SelectionListService,
    private injector: Injector,
    private viewsListService: ViewsListsService
    ) {
      this.dialogRef = this.injector.get(MatDialogRef, null)
      this.dialogData = this.injector.get(MAT_DIALOG_DATA, null)
     }

  ngOnInit(): void {
    if(this.dialogData){
      this.loadVariablesFromDialog()
    }
    this.loadList()
  }

  async loadList(){
    const resourceFields = await this.genericViewerDataSource.getFields()
    this.listOptions = this.selectionListService.createListOptions(this.selectionListConfiguration, this.genericViewer.smartSearchDataView, resourceFields, this.genericViewer.searchDataView)
    this.dataSource = await this.viewsListService.createListDataSource(this.genericViewerDataSource, this.genericViewer, resourceFields)
    this.loadCompleted = true
  }

  loadVariablesFromDialog(){
    this.genericViewer = this.dialogData.genericViewer
    this.genericViewer.title = this.genericViewer.view.Name;
    this.selectionListConfiguration = this.dialogData.configurationObj
    this.genericViewerDataSource = this.dialogData.gvDataSource
  }

  onButtonClicked(event){
    switch(event){
      case 'cancel':
        this.onCancelClicked()
        break
      case 'done':
        this.onDoneClicked()
        break
      default:
        return
    }
  }

  onDoneClicked(){
    const rows  = this.list.getSelectedRows()
    this.pressedDoneEvent.emit(rows)
  }
  
  onCancelClicked(){
    this.pressedCancelEvent.emit()
  }
}
