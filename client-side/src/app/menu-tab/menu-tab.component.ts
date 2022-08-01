import { CdkDragDrop, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { IPepProfile, IPepProfileDataViewsCard } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { MenuDataView, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { IMappedField } from '../metadata';
import { ProfileCardsManager } from '../profile-cards/profile-cards-manager';
import { DataViewService } from '../services/data-view-service';
import { ProfileService } from '../services/profile-service';
import { UtilitiesService } from '../services/utilities-service';

@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss']
})
export class MenuTabComponent implements OnInit {
  @Input() key: string
  dataViewsMap: Map<string,DataView> = new Map()
  currentCard: IPepProfileDataViewsCard
  currentDataView: MenuDataView
  mappedFields: Array<IMappedField> = []
  sideCardsList:Array<IPepDraggableItem> = []
  profileCardsManager: ProfileCardsManager
  availableProfiles: Array<IPepProfile> = [];
  profileCardsArray: Array<IPepProfileDataViewsCard> = [];
  defaultProfileId = 0
  editCard: boolean = false
  dataViewContextName: string
  constructor(private translate: TranslateService,
              private dataViewService: DataViewService,
              private profileService: ProfileService,
              private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.dataViewContextName = `GV_${this.key}_Menu`
    this.init()
  }
  async init(){
    const convertor = this.createConvertor()
    const fields = this.getFields()
    fields.sort((a,b) => a.FieldID.localeCompare(b.FieldID))
    this.profileCardsManager = new ProfileCardsManager(
      this.dataViewContextName,
      this.dataViewService,
      this.profileService,
      convertor,
      fields)
      await this.profileCardsManager.init()
      this.loadProfileCardVariables()

  }
  loadProfileCardVariables(){
    this.availableProfiles = this.profileCardsManager.getAvailableProfiles()
    this.profileCardsArray = this.profileCardsManager.getProfileCardsArray()
    this.sideCardsList = this.profileCardsManager.getCurrentSideCardsList()
    this.mappedFields = this.profileCardsManager.getCurrentMappedFields()
  }
  getFields(){    
    return [
      {
        FieldID: "Add",
        Title: "Add"
      },
      {
        FieldID: "Export",
        Title: "Export"
      },
      {
        FieldID: "Import",
        Title: "Import"
      },
      {
        FieldID: "RecycleBin",
        Title: "Recycle bin"
      },
    ]
  }

  createConvertor(){
    return {
      mappedFieldToField: this.mappedFieldToDataViewField,
      fieldToMappedField: this.fieldToMappedField,
      draggableItemToMappedField: this.draggableFieldToMappedField
    }
  }
  private mappedFieldToDataViewField(mappedField: IMappedField, index: number){
    return {
      FieldID: mappedField.field.FieldID,
      Title: mappedField.field.Title
    }
  }
  private fieldToMappedField(field: MenuDataViewField): IMappedField{
    return {
      field: {
        FieldID: field.FieldID,
        Title: field.Title
      }
    }
  }
  private draggableFieldToMappedField(draggableItem: IPepDraggableItem){
    return {
     field: {
       FieldID: draggableItem.data.FieldID,
       Title: draggableItem.data.Title, 
     },
    };
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
    this.utilitiesService.showDialog('Save', "SaveDialogMSG", 'close')
  }
}
