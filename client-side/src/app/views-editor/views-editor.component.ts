import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { ViewEditor } from '../editors/view-editor'
import { Location } from '@angular/common';
import { ProfileService } from '../services/profile-service'
import { IPepProfileDataViewsCard, IPepProfile, IPepProfileDataViewClickEvent, IPepProfileDataView } from '@pepperi-addons/ngx-lib/profile-data-views-list';

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
  availableProfiles: Array<IPepProfile> = [];
  defaultProfileId: string = '0';
  profileDataViewsList: Array<IPepProfileDataViewsCard> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private location: Location,
    private profileService: ProfileService
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
      this.initProfileDataViews()
    })
  }
  async initProfileDataViews(){
    this.availableProfiles = await  this.profileService.getProfiles()
    this.profileDataViewsList = this.availableProfiles.map(profile => {
      return {
        profileId: profile.id,
        title: profile.name,
        dataViews: [
          {
            dataViewId: profile.id,
            fields: [
              this.viewEditor.getName()
            ]
          }
        ]
      }
    })
  }

  onBackToList(){
    this.location.back()
  }
  onUpdate(){
    this.viewEditor.update()
  }
  onDataViewDeleteClicked($event){

  }
  onSaveNewProfileClicked($event){

  }
  onDataViewEditClicked($event){

  }
}
