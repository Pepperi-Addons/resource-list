import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { ViewEditor } from '../editors/view-editor'
import { Location } from '@angular/common';
import { IPepProfileDataViewsCard, IPepProfile } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import {CREATION_DATE_TIME_ID, MODIFICATION_DATE_TIME_ID, CREATION_DATE_TIME_TITLE, MODIFICATION_DATE_TIME_TITLE} from '../metadata'
import { DataViewService } from '../services/data-view-service'
import { Collection, DataView, GridDataView, GridDataViewField } from '@pepperi-addons/papi-sdk';
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
  resourceName: string
  dataViewContextName: string
  viewEditor: ViewEditor
  viewName: string
  editCard: boolean = false;
  currentTabIndex = 0;
  sideCardsList:Array<IPepDraggableItem> = []
  mappedFields: Array<IMappedField> = [];
  currentResourceField: string = undefined
  viewKey: string
  collectionFields: Collection
  currentDataView: GridDataView
  loadCompleted: boolean = false
  dataViewsMap: Map<string, DataView> = new Map()
  repDataViewID: string
  currentCard: IPepProfileDataViewsCard

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private location: Location,
    private dataViewService: DataViewService
    ){ 
      this.udcService.pluginUUID = config.AddonUUID
    }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key')
    this.dataViewContextName = `GV_${key}_View`
    this.viewEditor = new ViewEditor(
      this.router,
      this.route,
      this.translate,
      this.udcService,
      this.viewsService,
      )
      this.initViewEditor()
      .then(_ => {
        this.loadCompleted = true
        this.initCurrentCollection()
      })
  }
  // -------------------------------------------------------------
  //                        Init Functions                        
  // -------------------------------------------------------------
  async initCurrentCollection(){
    this.collectionFields = (await this.udcService.getCollection(this.dataSource.Resource))?.ListView?.Fields || []
    this.initSideCardsListAndFields(this.collectionFields)
  }
  async initViewEditor(){
    await this.viewEditor.init()
    this.dataSource = this.viewEditor.getDataSource()
    this.resourceName = this.dataSource.resourceName
    this.viewName = this.viewEditor.getName()
    this.dataView = this.viewEditor.getDataView()
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

  onEditCardEvent(event){
    this.currentDataView = event.dataview
    this.currentCard = event.card
    const mappedFieldsIDSet = new Set<string>()
    //you can use for here, and also put the width on same loop.
    this.mappedFields = this.currentDataView.Fields.map((field, index) => {
      mappedFieldsIDSet.add(field.FieldID)
      return this.fieldToMappedField(field, this.currentDataView.Columns[index].Width)
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
    this.currentDataView.Columns = this.mappedFields.map(mappedField =>{
      return { Width: mappedField.width }
    })
    this.currentDataView.Fields = this.mappedFieldsToDataViewFields(this.mappedFields)
    const dataview = await this.dataViewService.postDataView(this.currentDataView)
    this.dataViewsMap.set(dataview.InternalID.toString(), dataview)
    // const currentProfileCard = this.profileDataViewsList.find(profile => profile.profileId == this.currentDataView.Context.Profile.InternalID.toString());
    this.currentCard.dataViews[0].fields = this.mappedFields.map(field => field.field.Title)
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
