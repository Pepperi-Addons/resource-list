import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { View } from "../../../../shared/entities"
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { ViewEditor } from '../editors/view-editor'
import { Location } from '@angular/common';

@Component({
  selector: 'app-views-editor',
  templateUrl: './views-editor.component.html',
  styleUrls: ['./views-editor.component.scss']
})
export class ViewsEditorComponent implements OnInit {
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
  viewEditor: ViewEditor
  viewName: string

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
    this.viewEditor = new ViewEditor(
      this.router,
      this.route,
      this.translate,
      this.udcService,
      this.viewsService,
    )
    this.viewEditor.init().then(() => {
      this.viewName = this.viewEditor.getName()
      this.dataSource = this.viewEditor.getDataSource()
      this.dataView = this.viewEditor.getDataView()
    })
  }

  onBackToList(){
    this.location.back()
  }
  onUpdate(){
    this.viewEditor.update()
  }
}
