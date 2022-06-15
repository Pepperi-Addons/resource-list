import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { ViewEditor } from '../editors/view-editor'
import { Location } from '@angular/common';
import { ProfileService } from '../services/profile-service'
import { IPepProfileDataViewsCard, IPepProfile, IPepProfileDataView } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import {CREATION_DATE_TIME_ID, MODIFICATION_DATE_TIME_ID, CREATION_DATE_TIME_TITLE, MODIFICATION_DATE_TIME_TITLE} from '../metadata'
import { DataViewService } from '../services/data-view-service'
import { Collection, DataView, DataViewFieldType } from '@pepperi-addons/papi-sdk';
import * as uuid from 'uuid';


export interface IMappedField {
  id: string
  field: {
    FieldID: string
    Title: string;
    Type: DataViewFieldType;
    ReadOnly: boolean
    Mandatory: boolean
  }
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
  profileDataViewsList: Array<IPepProfileDataViewsCard> = [];
  editCard: boolean = false;
  currentTabIndex = 0;
  sideCardsList:Array<IPepDraggableItem> = []
  mappedFields: Array<IMappedField> = [];
  // resourceFields = []
  currentResourceField: string = undefined
  viewKey: string
  collectionFields: Collection
  currentDataView: DataView
  loadCompleted: boolean = false
  dataViewsMap: Map<string, DataView> = new Map()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private location: Location,
    private profileService: ProfileService,
    private dataViewService: DataViewService
    ){ 
      this.udcService.pluginUUID = config.AddonUUID
    }

  ngOnInit(): void {
    this.viewKey = this.route.snapshot.paramMap.get('key')
    this.viewEditor = new ViewEditor(
      this.router,
      this.route,
      this.translate,
      this.udcService,
      this.viewsService,
      )
      Promise.all([this.initViewEditor(this.viewKey), this.initDataViewsAndProfiles(this.viewKey)])
      .then(async _ => {
        this.dataSource = this.viewEditor.getDataSource()
        await this.initProfileCards()
        this.loadCompleted = true
        // this.initDataViewsAndProfiles(this.viewKey)
      })
    }
    async initViewEditor(key: string){
      await this.viewEditor.init(this.viewKey)
      this.viewName = this.viewEditor.getName()
      this.dataSource = this.viewEditor.getDataSource()
      this.dataView = this.viewEditor.getDataView()
    }
    async initDataViewsAndProfiles(key:string){
      const [profiles, dataViews] = await Promise.all([this.profileService.getProfiles(), this.dataViewService.getDataViews(this.viewKey)])
      this.availableProfiles = profiles
      this.initDataViewsMap(dataViews)
      // this.loadCompleted = this.viewKey != "new"
    }
    async initProfileCards(){
      this.collectionFields  = (await this.udcService.getCollection(this.dataSource.Resource))?.ListView?.Fields || []
      this.initSideCardsListAndFields(this.collectionFields)
      this.initProfilesCardsByDataViews()
    }
    initDataViewsMap(dataViews: DataView[]){
      dataViews.forEach(dataView => {
        this.dataViewsMap.set(dataView.InternalID.toString(), dataView)
      })
    }
    initProfilesCardsByDataViews(){
      this.profileDataViewsList = []
      for(const [id, dataView] of this.dataViewsMap.entries()){
        this.profileDataViewsList.push({
          profileId: dataView.Context.Profile.InternalID.toString(),
          title: dataView.Context.Profile.Name,
          dataViews: [
            {
              dataViewId: id.toString(),
              fields: dataView.Fields.map(field => field.Title) || []
            }
          ]
        })
      }
    }
    //get the data view that corresponding to the profile, if there is no such data view the function will create new one without saving it in the db
    getProfileDataview(id: string): IPepProfileDataView[]{
      const dataView = this.dataViewsMap.get(id)
      return [
        {
        dataViewId: id,
        fields: dataView?.Fields?.map(field => field.title) || []
      }
    ]
  }
  onBackToList(){
    this.location.back()
  }
  //save the profile data views and the view editor
  onUpdate(){
    this.viewEditor.update()
  }
  //remove profile card from the page
  onDataViewDeleteClicked($event){
    const currentDataView = this.dataViewsMap.get($event.dataViewId)
    currentDataView.Hidden = true
    this.dataViewService.postDataView(currentDataView)
    this.profileDataViewsList = this.profileDataViewsList.filter(profile => profile.profileId != currentDataView.Context.Profile.InternalID.toString())
    this.dataViewsMap.delete(currentDataView.InternalID.toString())
  }

  //add profile card to the page
  async onSaveNewProfileClicked($event){
    const profile = this.availableProfiles?.find(profile => profile.id == $event)
    const dataView = await this.dataViewService.postDataView({
      Type: 'Grid',
      Fields: [],
      Columns: [],
      Context: {
        Name: `GV_${this.viewKey}_View`,
        ScreenSize: 'Tablet',
        Profile:{
          InternalID: Number(profile.id),
          Name: profile.name
        },
      }
    })
    if(!dataView?.InternalID){
      throw new Error("internal error - could not post data view.")
    }
    this.dataViewsMap.set(dataView.InternalID.toString(), dataView)
    this.profileDataViewsList.push({
      profileId: profile.id,
      title: profile.name,
      dataViews: [
        {
          dataViewId: dataView.InternalID.toString(),
          fields: []
        }
      ]
    })
  }

  onDataViewEditClicked($event){
    debugger
    this.currentDataView = this.dataViewsMap.get($event.dataViewId)
    this.mappedFields = this.currentDataView.Fields.map(field => {
      return {
        id: uuid.v4(),
        field: field
      }
    }) || []
    this.editCard = true
  }

  //-------------------- mapping fields ---------------------------
  initSideCardsListAndFields(resourcefields: any){
    this.sideCardsList = [
      {
        data: {
          key: undefined,
          FieldID: CREATION_DATE_TIME_ID,
          Title: CREATION_DATE_TIME_TITLE,
          Type: 'DateAndTime',
          Mandatory: true,
          ReadOnly: true
        },
        title: this.translate.instant(CREATION_DATE_TIME_TITLE)
      },
      {
        data: {
          key: undefined,
          FieldID: MODIFICATION_DATE_TIME_ID,
          Title: MODIFICATION_DATE_TIME_TITLE,
          Type: 'DateAndTime',
          Mandatory: true,
          ReadOnly: true
        },
        title: this.translate.instant(MODIFICATION_DATE_TIME_TITLE)
      }
    ]
    // this.fillSideCardsListAndFields(resourcefields)
    debugger
    resourcefields.forEach(field => {
      this.sideCardsList.push({
        title: field.Title,
        data: field
      })
    })
    this.sortFields()
  }
  sortFields(){
    this.sideCardsList.sort((a,b) => {
      if(a.title < b.title){
        return  -1;
      }
      else if(a.title > b.title){
        return 1;
      }
      return 0;
    })
  }
  backFromCardsTemplate(){
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
    debugger
    if (event.previousContainer === event.container) {
      //update Layout
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.container.id === 'emptyDropArea') {
        this.addNewField(event.previousContainer.data[event.previousIndex], this.mappedFields.length);
    } else {
        this.addNewField(event.previousContainer.data[event.previousIndex], event.currentIndex);
    }
  }
  private addNewField(draggableItem: IPepDraggableItem, index: number) {
    const mappedField: IMappedField  = {
      id: uuid.v4(),
      field: {
        FieldID: draggableItem.data.FieldID,
        Title: draggableItem.data.Title, 
        Mandatory: draggableItem.data.Mandatory,
        ReadOnly: draggableItem.data.ReadOnly,
        Type: draggableItem.data.Type,
      }
     };
    this.mappedFields.splice(index, 0, mappedField);
  }
  onCardRemoveClick(id){
    //change it to remove mapped field by uniqe id 
    const index = this.mappedFields.findIndex( ms => ms.id === id);
    if (index > -1) {
        this.mappedFields.splice(index, 1);
    }
  }

  onSaveDataView(){
    this.dataViewService.postDataView({
      Type: 'Grid',
      Hidden: false,
      Fields: this.mappedFields.map((mappedField, index) => {
        const field = mappedField.field
        field["Layout"] = {
          Origin: {
            X: index,
            Y: 0
          }
        }
        field["Style"] = {
          Alignment: {
            Vertical: "Center",
            Horizontal: "Stretch"
          }
        }
        return field
      }),
      Columns: this.mappedFields.map(_ => {
        return { Width: 10}
      }),
      Context: {
        Name: `GV_${this.viewKey}_View`,
        ScreenSize: 'Tablet',
        Profile:{
          InternalID: Number(this.currentDataView.Context.Profile.InternalID),
        },
      }
    })
  }
}
