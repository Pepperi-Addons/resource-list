import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DataSource } from '../data-source/data-source';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { DataViewService } from '../services/data-view-service';
import { EditorsService } from '../services/editors.service';
import { Editor } from 'shared';
@Component({
    selector: 'data-configuration-block',
    templateUrl: './data-configuration-block.component.html',
    styleUrls: ['./data-configuration-block.component.scss']
})
export class DataConfigurationBlockComponent implements OnInit {
    @Input() hostObject: any;
    datasource: DataSource
    menuItems: PepMenuItem[] = [];
    typeMap: any;
    currentResourceName: string = ""
    minHeight: number
    relativeHeight: number
    item = {} 
    fields: any[] = []
    dataView: any
    currentEditorKey: string
    editor: Editor
    loadCompleted: Boolean = false
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
       private dataViewService: DataViewService,
       private editorsService: EditorsService) {

       }
    ngOnInit(): void {
      this.loadCompleted = false
      this.loadBlock()
    }
    ngOnChanges($event){
      this.loadCompleted = false
      this.loadBlock()
    }
    async loadBlock(){
      this.currentEditorKey = this.hostObject?.configuration?.currentEditorKey
      if(this.currentEditorKey != undefined){
        [this.editor] = await this.editorsService.getItems(this.currentEditorKey)
        const editorDataViews = await this.dataViewService.getDataViews(`GV_${this.currentEditorKey}_Editor`)
        this.dataView = editorDataViews[0] 

      }else{
        this.dataView = {}
      }
      this.loadCompleted = true
    }
}
