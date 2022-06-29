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
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import {CREATION_DATE_TIME_ID, MODIFICATION_DATE_TIME_ID, CREATION_DATE_TIME_TITLE, MODIFICATION_DATE_TIME_TITLE} from '../metadata'
import { DataViewService } from '../services/data-view-service'
import { Collection, DataView, DataViewField, GridDataView, GridDataViewField } from '@pepperi-addons/papi-sdk';
import { IMappedField } from '../metadata';
import * as uuid from 'uuid';


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
  currentResourceField: string = undefined
  viewKey: string
  collectionFields: Collection
  currentDataView: GridDataView
  loadCompleted: boolean = false
  dataViewsMap: Map<string, GridDataView> = new Map()
  repDataViewID: string

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
      })
  }

  // -------------------------------------------------------------
  //                        Init Functions                        
  // -------------------------------------------------------------

  async initViewEditor(key: string){
    await this.viewEditor.init(this.viewKey)
    this.viewName = this.viewEditor.getName()
    this.dataSource = this.viewEditor.getDataSource()
    this.dataView = this.viewEditor.getDataView()
  }
  async initDataViewsAndProfiles(key:string){
    const [profiles, dataViews] = await Promise.all([this.profileService.getProfiles(), this.dataViewService.getDataViews(this.viewKey)])
    this.availableProfiles = profiles
    await this.initDataViewsMap(dataViews)
  }
  async initProfileCards(){
    this.collectionFields  = (await this.udcService.getCollection(this.dataSource.Resource))?.ListView?.Fields || []
    this.initSideCardsListAndFields(this.collectionFields)
    this.initProfilesCardsByDataViews()
  }
  async initDataViewsMap(dataViews: GridDataView[]){
    let repFound = false;
    const notAvilablesProfiles = new Set<string>()
    dataViews.forEach(dataView => {
      if(dataView.Context?.Profile?.Name == 'Rep'){
        repFound = true
        this.repDataViewID = dataView.InternalID.toString()
      }
      this.dataViewsMap.set(dataView.InternalID.toString(), dataView)
      notAvilablesProfiles.add(dataView.Context.Profile.InternalID.toString())
    })
    //if profile is not in available set then the profile card already exist!
    this.availableProfiles = this.availableProfiles.filter(availableProfile => !notAvilablesProfiles.has(availableProfile.id))
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
  onBackToList(){
    this.location.back()
  }
  //save the profile data views and the view editor
  onUpdate(){
    this.viewEditor.update()
  }

  //-----------------------------------------------------------------------
  //                        Profiles Cards Function
  //-----------------------------------------------------------------------

  //remove profile card from the page
  onDataViewDeleteClicked($event){
    const currentDataView = this.dataViewsMap.get($event.dataViewId)
    if(currentDataView.Context.Profile.Name == 'Rep'){
      return
    }
    currentDataView.Hidden = true
    this.dataViewService.postDataView(currentDataView)
    this.profileDataViewsList = this.profileDataViewsList.filter(profile => profile.profileId != currentDataView.Context.Profile.InternalID.toString())
    this.dataViewsMap.delete(currentDataView.InternalID.toString())
    this.availableProfiles.push({
      id: currentDataView.Context.Profile.InternalID.toString(),
      name: currentDataView.Context.Profile.Name
    })
  }
  async postNewDataViewAndSaveOnMap(profile: IPepProfile, fields: GridDataViewField[] = [], columns: {Width: number}[] = []){
    const dataView = await this.dataViewService.postDataView({
      Type: 'Grid',
      Hidden: false,
      Fields: fields,
      Columns: columns,
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
    return dataView
  }
  //add profile card to the page
  async onSaveNewProfileClicked($event){
    const repDataview = this.dataViewsMap.get(this.repDataViewID)
    const repFields = repDataview?.Fields || []
    const repColumns = repDataview?.Columns || []
    const profile = this.availableProfiles?.find(profile => profile.id == $event)
    const dataView = await this.postNewDataViewAndSaveOnMap(profile, repFields, repColumns)
    this.profileDataViewsList.push({
      profileId: profile.id,
      title: profile.name,
      dataViews: [
        {
          dataViewId: dataView.InternalID.toString(),
          fields: repFields.map(field => field.Title)
        }
      ]
    })
    this.availableProfiles = this.availableProfiles.filter(availableProfile => availableProfile.id != profile.id)
  }
  onDataViewEditClicked($event){
    this.currentDataView = this.dataViewsMap.get($event.dataViewId)
    const mappedFieldsIDSet = new Set<string>()
    //you can use for here, and also put the width on same loop.
    this.mappedFields = this.currentDataView.Fields.map((field, index) => {
      mappedFieldsIDSet.add(field.FieldID)
      return this.fieldToMappedField(field, this.currentDataView.Columns[index].Width)
      // return {
      //   id: uuid.v4(),
      //   field: field,
      //   width: 10
      // }
    }) || []
    this.sideCardsList = this.sideCardsList.filter(card => !mappedFieldsIDSet.has(card.data.FieldID))
    this.editCard = true
  }

  //-------------------------------------------------------------------------
  //                         Mapping Fields Functions 
  //-------------------------------------------------------------------------

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
    if (event.previousContainer === event.container) {
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
      },
      width : 10
     };
    this.mappedFields.splice(index, 0, mappedField);
    this.sideCardsList = this.sideCardsList.filter(field => field.data.FieldID != draggableItem.data.FieldID)
  }
  onCardRemoveClick(id){
    const index = this.mappedFields.findIndex(ms => ms.id === id);
    if (index > -1) {
      this.mappedFields[index].field.Title = this.mappedFields[index].field.FieldID
      this.sideCardsList.push({
        title: this.translate.instant(this.mappedFields[index].field.FieldID),
        data: {key: undefined, ...this.mappedFields[index].field}
      })
      this.mappedFields.splice(index, 1);
    }
  }
  async onSaveDataView(){
    const fields = this.mappedFieldsToDataViewFields(this.mappedFields)
    const columns = this.mappedFields.map(mappedField =>{
      return { Width: mappedField.width }
    })
    const dataView = await this.postNewDataViewAndSaveOnMap(
      {
        id: this.currentDataView.Context.Profile.InternalID.toString(),
        name: this.currentDataView.Context.Profile.Name
      },
      fields,
      columns
    )
    this.dataViewsMap.set(dataView.InternalID.toString(), dataView)
    const currentProfileCard = this.profileDataViewsList.find(profile => profile.profileId == this.currentDataView.Context.Profile.InternalID.toString());
    currentProfileCard.dataViews[0].fields = this.mappedFields.map(field => field.field.Title)
  }

  
  mappedFieldToDataViewField(mappedField: IMappedField, index: number): GridDataViewField{
    return {
      FieldID: mappedField.field.FieldID,
      Title: mappedField.field.Title,
      ReadOnly: mappedField.field.ReadOnly,
      Mandatory: mappedField.field.Mandatory,
      Type: mappedField.field.Type,
      Style: {
        Alignment: {
          Vertical: "Center",
          Horizontal: "Stretch"
        }
      },
      Layout: {
        Origin: {
          X: index,
          Y: 0
        }
      }
    }
  }
  mappedFieldsToDataViewFields(mappedFields: IMappedField[]): GridDataViewField[]{
    return mappedFields.map((mappedField, index) => {
        return this.mappedFieldToDataViewField(mappedField, index)
    })
  }
  fieldToMappedField(field: GridDataViewField, width = 10): IMappedField{
    return {
      id: uuid.v4(),
      field: field,
      width: width
    }
  }
  fieldsToMappedFields(fields: GridDataViewField[], columns: {Width: number}[]): IMappedField[]{
    const mappedFields = []
    fields.forEach((field,index) => {
      mappedFields.push({
        id: uuid.v4(),
        field: field,
        width: columns[index]
      })
    })
    return mappedFields
  }
}
