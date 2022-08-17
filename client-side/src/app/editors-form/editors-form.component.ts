import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../addon.config';
import { GenericResourceService } from '../services/generic-resource-service';
import { EditorForm } from '../editors/editor-form'
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { OpenMode } from '../../../../shared/entities'
import { EditorsService } from '../services/editors.service';
import { BaseFormDataViewField, Collection, DataView, FormDataView } from '@pepperi-addons/papi-sdk';
import { IPepProfile, IPepProfileDataViewsCard } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { IDataViewField, IEditorMappedField, IMappedField } from '../metadata';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { DataViewService } from '../services/data-view-service';
import { ProfileCardsManager } from '../profile-cards/profile-cards-manager'
import { ProfileService } from '../services/profile-service';
import { PepDialogActionsType, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

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
  mappedFields: Array<IMappedField> = []
  sideCardsList:Array<IPepDraggableItem> = []
  profileCardsManager: ProfileCardsManager
  availableProfiles: Array<IPepProfile> = [];
  profileCardsArray: Array<IPepProfileDataViewsCard> = [];
  defaultProfileId = 0

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private editorsService: EditorsService,
    private translate: TranslateService,
    private genericResource: GenericResourceService,
    private dataViewService: DataViewService,
    private profileService: ProfileService,
    private dialogService: PepDialogService,
    ){ 
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
    this.dataViewContextName = `GV_${key.replace(/-/g, '')}_Editor`
    this.editorForm = new EditorForm(
      this.router,
      this.route,
      this.translate,
      this.genericResource,
      this.editorsService
    )
    this.editorForm.init().then(() => {
      this.editorName = this.editorForm.getName()
      this.dataSource = this.editorForm.getDataSource()
      this.dataView = this.editorForm.getDataView()
      this.resourceName = this.dataSource.Resource
      this.initFormTab()

    })
  }
  async initFormTab(){
    const convertor = this.createConvertor()
    this.profileCardsManager = new ProfileCardsManager(this.genericResource,
      this.dataViewContextName,
      this.resourceName,
      this.dataViewService,
      this.profileService,
      convertor)
      await this.profileCardsManager.init()
      this.loadProfileCardVariables()
  }
  createConvertor(){
    return {
      mappedFieldToField: this.mappedFieldToDataViewField,
      fieldToMappedField: this.fieldToEditorMappedField,
      draggableItemToMappedField: this.draggableFieldToMappedField
    }
  }
  loadProfileCardVariables():void{
    this.availableProfiles = this.profileCardsManager.getAvailableProfiles()
    this.profileCardsArray = this.profileCardsManager.getProfileCardsArray()
    this.sideCardsList = this.profileCardsManager.getCurrentSideCardsList()
    this.mappedFields = this.profileCardsManager.getCurrentMappedFields()
  }
  onDataViewEditClicked(event){
    this.profileCardsManager.editCard(Number(event.dataViewId))
    this.loadProfileCardVariables()
    this.editCard = true
  }
  async onSaveNewProfileClicked(event){
    await this.profileCardsManager.createCard(event)
    this.loadProfileCardVariables()
  }
  async onDataViewDeleteClicked($event){
    await this.profileCardsManager.deleteCard(Number($event.dataViewId))
    this.loadProfileCardVariables()
  }
  onBackToList(){
    this.router.navigate(["../.."],{ relativeTo: this.route },)
  }
  onUpdate(){
    this.editorForm.update()
    this.showDialog('Update', 'UpdateDialogMSG', 'close')
  }
  onOpenModeChange(event){
    this.openMode = event
    this.editorForm.setOpenMode(this.openMode)
  }
  //mapped fields
  fieldToEditorMappedField(field: BaseFormDataViewField): IEditorMappedField{
    return {
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
    this.profileCardsManager.dropField(event)
    this.loadProfileCardVariables()
  }
  private draggableFieldToMappedField(draggableItem: IPepDraggableItem){
     return {
      field: {
        FieldID: draggableItem.data.FieldID,
        Title: draggableItem.data.Title, 
        Mandatory: draggableItem.data.Mandatory,
        ReadOnly: draggableItem.data.ReadOnly,
        Type: draggableItem.data.Type,
      },
     };
  }
  //remove mapped field
  onCardRemoveClick(id){
    this.profileCardsManager.removeMappedField(id)
    this.loadProfileCardVariables()
  }
  async onSaveDataView(){
    await this.profileCardsManager.saveCurrentDataView()
    this.showDialog('Save', 'SaveDialogMSG', 'close')
  }
  showDialog(title: string, content: string, actionsType: PepDialogActionsType){
    const dataMsg = new PepDialogData({
      title: this.translate.instant(title),
      actionsType: actionsType,
      content: this.translate.instant(content)
    });
    this.dialogService.openDefaultDialog(dataMsg)
  }
  mappedFieldsToDataViewFields(mappedFields: IEditorMappedField[]): IDataViewField[]{
    return mappedFields.map((mappedField, index) => {
        return this.mappedFieldToDataViewField(mappedField, index)
    })
  }
  mappedFieldToDataViewField(mappedField: IMappedField, index: number): IDataViewField{
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
