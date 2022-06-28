import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from '../../../../shared/entities';
import { config } from '../addon.config';
import { UDCService } from '../services/udc-service';
import { ViewsService } from '../services/views.service';
import { EditorForm } from '../editors/editor-form'
import {Location} from '@angular/common';
import { IPepOption, PepSelectField } from '@pepperi-addons/ngx-lib';
import { OpenMode } from '../../../../shared/entities'

@Component({
  selector: 'app-editors-form',
  templateUrl: './editors-form.component.html',
  styleUrls: ['./editors-form.component.scss']
})
export class EditorsFormComponent implements OnInit {
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
  editorForm: EditorForm
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
        value: this.translate.instant("Replace")
      },
      {
        key: "popup",
        value: this.translate.instant("Popup")
      }
    ]
    this.editorForm = new EditorForm(
      this.router,
      this.route,
      this.translate,
      this.udcService,
      this.viewsService
    )
    this.editorForm.init(this.editorKey).then(() => {
      this.editorName = this.editorForm.getName()
      this.dataSource = this.editorForm.getDataSource()
      this.dataView = this.editorForm.getDataView()
    })
  }
  onBackToList(){
    this.router.navigate(["../.."],{ relativeTo: this.route })
  }
  onUpdate(){
    this.editorForm.update()
  }
  onOpenModeChange(event){
    this.openMode = event
    this.editorForm.setOpenMode(this.openMode)
  }
}
