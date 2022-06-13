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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { IPepOption, PepSelectField } from '@pepperi-addons/ngx-lib';
import {CREATION_DATE_TIME, MODIFICATION_DATE_TIME} from '../metadata'


export interface IMappedField {
  field: string;
}

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
  allProfiles: Array<IPepProfile>
  defaultProfileId: string = '0';
  profileDataViewsList: Array<IPepProfileDataViewsCard> = [];
  editCard: boolean = false;
  currentTabIndex = 0;
  sideCardsList:Array<IPepDraggableItem> = []
  mappedFields: Array<IMappedField> = [];
  resourceFields: IPepOption[] = []
  currentResourceField: string = undefined
  

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
      // this.initProfileDataViews()
    })
    this.initCardsList();
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
            ]
          }
        ]
      }
    })
  }

  initCardsList(){

  }

  onBackToList(){
    this.location.back()
  }
  onUpdate(){
    //need to update data view also
    this.viewEditor.update()
  }
  onDataViewDeleteClicked($event){
    this.profileDataViewsList = this.profileDataViewsList.filter(profile => profile.profileId != $event.dataViewId)
  }
  onSaveNewProfileClicked($event){
    const profile = this.availableProfiles?.find(profile => profile.id == $event)
    this.profileDataViewsList.push({
      profileId: profile.id,
      title: profile.name,
      dataViews: [
        {
          dataViewId: profile.id,
          fields: []
        }
      ]
    })
  }
  async onDataViewEditClicked($event){
    //get fields of resource
    const udcSchemes = await this.udcService.getCollections()
    const currentResourceFields = udcSchemes.find(scheme => scheme.Name == this.dataSource?.Resource)?.Fields || {}
    this.initSideCardsListAndFields(currentResourceFields)
    // await this.initResourceFields()
    this.editCard = true
  }
  onTabChanged(tabChangeEvent: MatTabChangeEvent){
    this.currentTabIndex = tabChangeEvent.index
    if(this.currentTabIndex == 1){
      this.dataSource = this.viewEditor.getDataSource()
      this.initProfilesCards()
    }

  }
  async initProfilesCards(){
    //get all profiles
    this.availableProfiles = await this.profileService.getProfiles()
  }


  //-------------------- mapping fields ---------------------------
  initSideCardsListAndFields(resourcefields: any){
    const fields = Object.keys(resourcefields)
    debugger
    this.resourceFields = [
      {
        key: this.translate.instant(CREATION_DATE_TIME),
        value: this.translate.instant(CREATION_DATE_TIME)
      },
      {
        key: this.translate.instant(MODIFICATION_DATE_TIME),
        value: this.translate.instant(MODIFICATION_DATE_TIME)
      }
    ]
    this.fillSideCardsListAndFields(fields)
    this.sortFields()
  }

  fillSideCardsListAndFields(fields: string[]){
    fields.forEach(key => {
      this.resourceFields.push({
        key: key,
        value: key
      })
      this.sideCardsList.push({
        title: key,
        data: {
          key: key
        }
      })
    })
  }
  sortFields(){
    this.resourceFields.sort((a,b) => {
      if(a.key < b.key){
        return  -1;
      }
      else if(a.key > b.key){
        return 1;
      }
      return 0;
    })
  }
  backFromCardsTemplate(){
    //restore the side cards list ! 
    this.editCard = false
  }
  onDragStart(event: CdkDragStart) {
    this.changeCursorOnDragStart();
  }
  onDragEnd(event: CdkDragEnd) {
    this.changeCursorOnDragEnd();
  }
  private changeCursorOnDragStart() {
    document.body.classList.add('inheritCursors');
    document.body.style.cursor = 'grabbing';
  }
  private changeCursorOnDragEnd() {
    document.body.classList.remove('inheritCursors');
    document.body.style.cursor = 'unset';
  }
  onDropField(event: CdkDragDrop<IPepDraggableItem[]>) {
    if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.container.id === 'emptyDropArea') {
        this.addNewField(event.previousContainer.data[event.previousIndex], this.mappedFields.length);
    } else {
        this.addNewField(event.previousContainer.data[event.previousIndex], event.currentIndex);
    }
  }
  private addNewField(draggableItem: IPepDraggableItem, index: number) {
    // this.setAvailableSlugPermission(draggableItem.data.key, true);
    // Add new mappedSlug to the mappedSlugs.
    const mappedField = { field: draggableItem.data.key };
    this.mappedFields.splice(index, 0, mappedField);
  }
  onResourceFieldChange($event, mappedField){
    mappedField.field = $event
  }
  onCardRemoveClick(mappedField){
    const index = this.mappedFields.findIndex( ms => ms.field === mappedField.field);
    if (index > -1) {
        this.mappedFields.splice(index, 1);
    }
  }
}
