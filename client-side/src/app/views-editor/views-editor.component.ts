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
import {CREATION_DATE_TIME_ID, MODIFICATION_DATE_TIME_ID, CREATION_DATE_TIME_TITLE, MODIFICATION_DATE_TIME_TITLE, IViewMappedField} from '../metadata'
import { DataViewService } from '../services/data-view-service'
import { Collection, DataView, GridDataView, GridDataViewField } from '@pepperi-addons/papi-sdk';
import { IMappedField } from '../metadata';
import * as uuid from 'uuid';
import { View } from '../../../../shared/entities';
import { EditorsService } from '../services/editors.service';


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
  editCard: boolean = false;
  currentTabIndex = 0;
  sideCardsList:Array<IPepDraggableItem> = []
  mappedFields: Array<IViewMappedField> = [];
  viewKey: string
  collectionFields: Collection
  currentDataView: GridDataView
  loadCompleted: boolean = false
  dataViewsMap: Map<string, DataView> = new Map()
  repDataViewID: string
  currentCard: IPepProfileDataViewsCard
  currentView: View

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private location: Location,
    private dataViewService: DataViewService,
    private editorsService: EditorsService
    ){ 
      this.udcService.pluginUUID = config.AddonUUID
    }

  ngOnInit(): void {
    this.initComponent()
  }
  // -------------------------------------------------------------
  //                        Init Functions                        
  // -------------------------------------------------------------
  async initComponent(){
    const key = this.route.snapshot.paramMap.get('key')
    this.dataViewContextName = `GV_${key}_View`
    await this.initGeneralTab(key)
    this.loadCompleted = true
    this.initCurrentCollection()
  }
  async initCurrentCollection(){
    this.collectionFields = (await this.udcService.getCollection(this.dataSource.Resource))?.ListView?.Fields || []
    this.initSideCardsListAndFields(this.collectionFields)
  }
  async initGeneralTab(key){
    this.currentView = (await this.viewsService.getItems(key))[0]
    const editorOptionalValues = await this.getEditorOptionalValues()
    this.dataSource = this.convertViewToDataSource(this.currentView)
    this.dataView = this.getDataview(editorOptionalValues)
  }
  async getEditorOptionalValues(){
    const editors = await this.editorsService.getItems()
    const editorsOfCurrentView = editors.filter((editor) => editor.Resource.Name == this.currentView.Resource.Name)
    return editorsOfCurrentView.map(editor => {
      return {
        Key: editor.Key,
        Value: editor.Name
      }
    })
  }
  convertViewToDataSource(view: View){
    return {
      Name: view.Name,
      Description: view.Description,
      Resource: view.Resource.Name,
      Editor: view.Editor
    }
  }
  getDataview(editorOptionalValues){
    return  {
      Type: "Form",
      Fields: this.getDataViewFields(editorOptionalValues),
      Context: {
        Name: "",
        Profile: {},
        ScreenSize: 'Tablet'
      }
    }
  }
  getDataViewFields(editorsOptoinalValues){
    return [
      {
      ReadOnly: true,
      Title: this.translate.instant('Name'),
      Type: 'TextBox',
      FieldID: "Name",
      Mandatory: false,
      Layout: {
          Origin: {
          X: 0,
          Y:0
          },
          Size: {
          Width: 1,
          Height: 0
          }
      }
      },
      {
      ReadOnly: false,
      Title: this.translate.instant('Description'),
      Type: 'TextBox',
      FieldID: "Description",
      Mandatory: false,
      Layout: {
          Origin: {
          X: 1,
          Y: 0
          },
          Size: {
          Width: 1,
          Height: 0
          }
      }
      },
      {
      ReadOnly: true,
      Title: this.translate.instant('Resource'),
      Type: 'TextBox',
      FieldID: "Resource",
      Mandatory: false,
      Layout: {
          Origin: {
          X: 0,
          Y:1
          },
          Size: {
          Width: 1,
          Height: 0
          }
      }
      },
      {
        ReadOnly: editorsOptoinalValues.length == 0,
        Title: this.translate.instant('Editor'),
        Type: 'ComboBox',
        FieldID: "Editor",
        Mandatory: false,
        OptionalValues: editorsOptoinalValues,
        Layout: {
            Origin: {
            X: 1,
            Y:1
            },
            Size: {
            Width: 1,
            Height: 0
            }
        }
        }
  ]
  }


  onBackToList(){
    this.location.back()
  }
  //save the profile data views and the view editor
  onUpdate(){
    this.currentView.Description = this.dataSource.Description
    this.currentView.Editor = this.dataSource.Editor
    this.viewsService.upsertItem(this.currentView)
  }

  //-----------------------------------------------------------------------
  //                        Profiles Cards Function
  //-----------------------------------------------------------------------

  onEditCardEvent(event){
    this.currentDataView = event.dataview
    this.currentCard = event.card
    const mappedFieldsIDSet = new Set<string>()
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
    const mappedField: IViewMappedField  = {
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
  fieldToMappedField(field: GridDataViewField, width = 10): IViewMappedField{
    return {
      id: uuid.v4(),
      field: field,
      width: width
    }
  }
  fieldsToMappedFields(fields: GridDataViewField[], columns: {Width: number}[]): IViewMappedField[]{
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
