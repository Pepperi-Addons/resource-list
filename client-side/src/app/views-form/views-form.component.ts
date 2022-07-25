import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { IPepProfileDataViewsCard, IPepProfile } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { IViewMappedField, IDataViewField} from '../metadata'
import { DataViewService } from '../services/data-view-service'
import { GridDataViewField } from '@pepperi-addons/papi-sdk';
import { IMappedField } from '../metadata';
import { View } from '../../../../shared/entities';
import { EditorsService } from '../services/editors.service';
import { ProfileCardsManager } from '../profile-cards/profile-cards-manager';
import { ProfileService } from '../services/profile-service';
import { PepDialogActionsType, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';


@Component({
  selector: 'app-views-form',
  templateUrl: './views-form.component.html',
  styleUrls: ['./views-form.component.scss']
})

export class ViewsFormComponent implements OnInit {
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
  viewKey: string
  loadCompleted: boolean = false
  currentView: View
  mappedFields: Array<IMappedField> = []
  sideCardsList:Array<IPepDraggableItem> = []
  profileCardsManager: ProfileCardsManager
  availableProfiles: Array<IPepProfile> = [];
  profileCardsArray: Array<IPepProfileDataViewsCard> = [];
  defaultProfileId = 0

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService,
    private dataViewService: DataViewService,
    private editorsService: EditorsService,
    private profileService: ProfileService,
    private dialogService: PepDialogService
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

    this.dataViewContextName = `GV_${key?.replace(/-/g, '')}_View`
    await this.initGeneralTab(key)
    await this.initFormTab()
    this.loadCompleted = true
  }
  async initFormTab(){
    const convertor = this.createConvertor()
    this.profileCardsManager = new ProfileCardsManager(this.udcService,
      this.dataViewContextName,
      this.dataSource.Resource,
      this.dataViewService,
      this.profileService,
      convertor)
      await this.profileCardsManager.init()
      this.loadProfileCardVariables()
  }
  createConvertor(){
    return {
      mappedFieldToField: this.mappedFieldToDataViewField,
      fieldToMappedField: this.fieldToMappedField,
      draggableItemToMappedField: this.draggableFieldToMappedField
    }
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
     width: 10
    };
 }
  loadProfileCardVariables(){
    this.availableProfiles = this.profileCardsManager.getAvailableProfiles()
    this.profileCardsArray = this.profileCardsManager.getProfileCardsArray()
    this.sideCardsList = this.profileCardsManager.getCurrentSideCardsList()
    this.mappedFields = this.profileCardsManager.getCurrentMappedFields()
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
    this.router.navigate([".."], {
      relativeTo: this.route
    })
  }
  onUpdate(){
    this.currentView.Description = this.dataSource.Description
    this.currentView.Editor = this.dataSource.Editor
    this.viewsService.upsertItem(this.currentView)
    this.showDialog("Update", "UpdateDialogMSG", 'close')
  }
  //-----------------------------------------------------------------------
  //                        Profiles Cards Function
  //-----------------------------------------------------------------------

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
  //-------------------------------------------------------------------------
  //                         Mapping Fields Functions 
  //-------------------------------------------------------------------------

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
  //remove mapped field
  onCardRemoveClick(id){
    this.profileCardsManager.removeMappedField(id)
    this.loadProfileCardVariables()
  }
  async onSaveDataView(){
    await this.profileCardsManager.saveCurrentDataView()
    this.showDialog('Save', "SaveDialogMSG", 'close')
  }
  showDialog(title: string, content: string, actionsType: PepDialogActionsType){
    const dataMsg = new PepDialogData({
      title: this.translate.instant(title),
      actionsType: actionsType,
      content: this.translate.instant(content)
    });
    this.dialogService.openDefaultDialog(dataMsg)
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
      field: field,
      width: width
    }
  }
}
