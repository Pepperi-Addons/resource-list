import { CdkDragDrop, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { IPepProfile, IPepProfileDataViewsCard } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { DataViewField, MenuDataView, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { IDataViewField, IMappedField } from '../metadata';
import { ProfileCardsManager } from '../profile-cards/profile-cards-manager';
import { DataViewService } from '../services/data-view-service';
import { ProfileService } from '../services/profile-service';
import { UtilitiesService } from '../services/utilities-service';

@Component({
  selector: 'app-abstract-profile-cards-tab',
  templateUrl: './abstract-profile-cards-tab.component.html',
  styleUrls: ['./abstract-profile-cards-tab.component.scss']
})
export abstract class AbstractProfileCardsTabComponent {
  @Input() key: string
  dataViewContextName: string
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
  constructor(protected dataViewService: DataViewService,
    protected profileService: ProfileService,
    protected utilitiesService: UtilitiesService) { }

  abstract setDataViewContextName():void
  async init(){
    this.setDataViewContextName()
    const convertor = this.createConvertor()
    const fields = await this.getFields()
    fields.sort((a,b) => {
      if (a.FieldID.indexOf('.') >= 0 && b.FieldID.indexOf('.') < 0) {
        return 1;
      } else if (a.FieldID.indexOf('.') < 0 && b.FieldID.indexOf('.') >= 0) {
        return -1;
      }
    
      // If neither has a period or both have a period, sort alphabetically
      if (a.FieldID.toLocaleLowerCase() < b.FieldID.toLocaleLowerCase()) {
        return -1;
      } else if (a.FieldID.toLocaleLowerCase() > b.FieldID.toLocaleLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    })
    // fields.sort((a,b) => a.FieldID.localeCompare(b.FieldID))
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
  //should be abstract
  abstract getFields(): Promise<IDataViewField[]> | IDataViewField[]

  createConvertor(){
    return {
      mappedFieldToField: this.mappedFieldToDataViewField,
      fieldToMappedField: this.fieldToMappedField,
      draggableItemToMappedField: this.draggableFieldToMappedField
    }
  }
  //should be abstract
  abstract mappedFieldToDataViewField(mappedField: IMappedField, index: number): IDataViewField

  //should be abstract
  abstract fieldToMappedField(field: MenuDataViewField): IMappedField
  //should be abstract
  abstract draggableFieldToMappedField(draggableItem: IPepDraggableItem): IMappedField
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

