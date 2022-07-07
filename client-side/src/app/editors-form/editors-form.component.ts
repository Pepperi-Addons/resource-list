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
import { EditorsService } from '../services/editors.service';
import { BaseFormDataViewField, Collection, CollectionField, DataView, FormDataView } from '@pepperi-addons/papi-sdk';
import { IPepProfileDataViewsCard } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { CREATION_DATE_TIME_ID, CREATION_DATE_TIME_TITLE, IEditorMappedField, MODIFICATION_DATE_TIME_ID, MODIFICATION_DATE_TIME_TITLE } from '../metadata';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import * as uuid from 'uuid';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataViewService } from '../services/data-view-service';

@Component({
  selector: 'app-editors-form',
  templateUrl: './editors-form.component.html',
  styleUrls: ['./editors-form.component.scss']
})
export class EditorsFormComponent implements OnInit {
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
  editorName: string = ""
  openModes: IPepOption[] = []
  openMode: OpenMode = 'popup'
  editCard: boolean = false
  dataViewContextName: string
  //profile cards fields
  collectionFields: Collection
  resourceName: string
  dataViewsMap: Map<string,DataView> = new Map()
  currentCard: IPepProfileDataViewsCard
  currentDataView: FormDataView
  mappedFields: Array<IEditorMappedField> = []
  sideCardsList:Array<IPepDraggableItem> = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private editorsService: EditorsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private dataViewService: DataViewService
    ){ 
      this.udcService.pluginUUID = config.AddonUUID
    }

  ngOnInit(): void {
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
    const key = this.route.snapshot.paramMap.get('key')
    this.dataViewContextName = `GV_${key}_Editor`
    this.editorForm = new EditorForm(
      this.router,
      this.route,
      this.translate,
      this.udcService,
      this.editorsService
    )
    this.editorForm.init().then(() => {
      this.editorName = this.editorForm.getName()
      this.dataSource = this.editorForm.getDataSource()
      this.dataView = this.editorForm.getDataView()
      this.resourceName = this.dataSource.Resource
      this.initCurrentCollection()
    })
  }

  async initCurrentCollection(){
    this.collectionFields = (await this.udcService.getCollection(this.dataSource.Resource))?.ListView?.Fields || []
    this.initSideCardsListAndFields(this.collectionFields)
  }
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



  //mapped fields
  onBackToList(){
    this.router.navigate(["../.."],{ relativeTo: this.route, queryParamsHandling: 'merge' },)
  }
  onUpdate(){
    this.editorForm.update()
  }
  onOpenModeChange(event){
    this.openMode = event
    this.editorForm.setOpenMode(this.openMode)
  }

  onEditCardEvent(event){
    this.currentDataView = event.dataview
    this.currentCard = event.card
    const mappedFieldsIDSet = new Set<string>()
    this.mappedFields = this.currentDataView.Fields.map((field, index) => {
      mappedFieldsIDSet.add(field.FieldID)
      return this.fieldToEditorMappedField(field)
    }) || []
    this.sideCardsList = this.sideCardsList.filter(card => !mappedFieldsIDSet.has(card.data.FieldID))
    this.editCard = true
  }

  fieldToEditorMappedField(field: BaseFormDataViewField): IEditorMappedField{
    return {
      id: uuid.v4(),
      field: field,
    }
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
    const mappedField: IEditorMappedField  = {
      id: uuid.v4(),
      field: {
        FieldID: draggableItem.data.FieldID,
        Title: draggableItem.data.Title, 
        Mandatory: draggableItem.data.Mandatory,
        ReadOnly: draggableItem.data.ReadOnly,
        Type: draggableItem.data.Type,
      },
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
    this.currentDataView.Fields = this.mappedFieldsToDataViewFields(this.mappedFields)
    const dataview = await this.dataViewService.postDataView(this.currentDataView)
    this.dataViewsMap.set(dataview.InternalID.toString(), dataview)
    this.currentCard.dataViews[0].fields = this.mappedFields.map(field => field.field.Title)
  }

  mappedFieldsToDataViewFields(mappedFields: IEditorMappedField[]): BaseFormDataViewField[]{
    return mappedFields.map((mappedField, index) => {
        return this.mappedFieldToDataViewField(mappedField, index)
    })
  }
  mappedFieldToDataViewField(mappedField: IEditorMappedField, index: number): BaseFormDataViewField{
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
          X: 0,
          Y: index
        },
        Size: {
          Width: 1,
          Height: 1
        }
      }
    }
  }
}
