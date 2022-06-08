import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { ViewEditor } from '../editors/view-editor'
import { Location } from '@angular/common';
import { ProfileService } from '../services/profile-service'
import { IPepProfileDataViewsCard, IPepProfile, IPepProfileDataViewClickEvent, IPepProfileDataView } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { GenericFormComponent } from '@pepperi-addons/ngx-composite-lib/generic-form';


@Component({
  selector: 'app-views-editor',
  templateUrl: './views-editor.component.html',
  styleUrls: ['./views-editor.component.scss']
})


export class ViewsEditorComponent implements OnInit, AfterViewInit {
  @ViewChild(GenericFormComponent) genericForm! : GenericFormComponent
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
  editors: IPepOption[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private location: Location,
    private profileService: ProfileService,
    ){ 
      this.udcService.pluginUUID = config.AddonUUID
    }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    this.viewEditor = new ViewEditor(
      this.router,
      this.route,
      this.translate,
      this.udcService,
      this.viewsService,
      // this.genericForm
    )
    this.viewEditor.init().then(() => {
      this.viewName = this.viewEditor.getName()
      this.dataSource = this.viewEditor.getDataSource()
      this.dataView = this.viewEditor.getDataView()
      this.initProfileDataViews()
    })
    this.viewsService.getEditors().then(editors => {
      this.editors = editors.map(editor => {
        return {
          key: editor.Name,
          value: editor.key
        }
      })
    })
  }
  async initProfileDataViews(){
    this.availableProfiles = await  this.profileService.getProfiles()
    const editors = await this.viewsService.getEditors(this.viewEditor.content.EditorKey)
    const editor = editors && editors.length > 0? editors[0]: undefined
    this.profileDataViewsList = this.availableProfiles.map(profile => {
      return {
        profileId: profile.id,
        title: profile.name,
        dataViews: [
          {
            dataViewId: profile.id,
            fields: [
              editor?.Name
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
    this.router.navigate(['../profile_editor', $event.dataViewId], {
      relativeTo: this.route,
    })
  }
  onValueChange($event){
    debugger
    if($event.ApiName == 'Resource'){
      this.viewEditor.content.Resource.Name = $event.Value
      this.viewEditor.loadDataView()
      // this.viewEditor.setCurrentEditors()
    }
  }
}
