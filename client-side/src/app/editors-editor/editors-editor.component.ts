import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from '../../../../shared/entities';
import { config } from '../addon.config';
import { UDCService } from '../services/udc-service';
import { ViewsService } from '../services/views.service';
import { EditorEditor } from '../editors/editor-editor'
import {Location} from '@angular/common';
import { IPepOption, PepSelectField } from '@pepperi-addons/ngx-lib';
import { OpenMode } from '../../../../shared/entities'

@Component({
  selector: 'app-editors-editor',
  templateUrl: './editors-editor.component.html',
  styleUrls: ['./editors-editor.component.scss']
})
export class EditorsEditorComponent implements OnInit {
  editor: Editor
  editorKey: string
  dataSource: any = {}
  dataView: any = {
    Type: "Form",
    Fields: [],
    Context: {
      Name: "",
      Profile: {},
      ScreenSize: 'Tablet'
    }
  };
  editorEditor: EditorEditor
  editorName: string
  openModes: IPepOption[] = []
  openMode: OpenMode = 'popup'

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private location: Location
    ){ 
      this.udcService.pluginUUID = config.AddonUUID
    }

  ngOnInit(): void {
    this.editorKey = this.route.snapshot.paramMap.get('key')
    this.openModes = [
      {
        key: "same-page",
        value: this.translate.instant('replace the current page')
      },
      {
        key: "popup",
        value: this.translate.instant('open as popup')
      }
    ]
    this.editorEditor = new EditorEditor(
      this.router,
      this.route,
      this.translate,
      this.udcService,
      this.viewsService
    )
    this.editorEditor.init(this.editorKey).then(() => {
      this.editorName = this.editorEditor.getName()
      this.dataSource = this.editorEditor.getDataSource()
      this.dataView = this.editorEditor.getDataView()
    })
  }
  onBackToList(){
    this.location.back()
  }
  onUpdate(){
    this.editorEditor.update()
  }
  onOpenModeChange(event){
    this.openMode = event
    this.editorEditor.setOpenMode(this.openMode)
  }
}
