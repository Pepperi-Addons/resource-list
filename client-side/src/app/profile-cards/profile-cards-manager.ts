import { DataViewService } from '../services/data-view-service';
import { ProfileService } from '../services/profile-service';
import { BaseDataView, DataView, DataViewColumn, DataViewType } from '@pepperi-addons/papi-sdk';
import { IPepProfile, IPepProfileDataViewsCard } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { IFieldConvertor, IMappedField } from '../metadata'
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export class ProfileCardsManager{
    private currentDataView: DataView
    private allProfiles: IPepProfile[] = []
    private dataViewMap: Map<number, DataView> = new Map()
    private profileCardsArray: Array<IPepProfileDataViewsCard> = [];
    private availableProfiles: Array<IPepProfile> = []
    private currentMappedFields: Array<IMappedField> = []
    private currentSideCardsList: IPepDraggableItem[] = []
    constructor(
                private dataViewContextName: string,
                private dataViewService: DataViewService,
                private profileService: ProfileService,
                private fieldConvertor: IFieldConvertor,
                private fields: any[]
                ){}
    async init(): Promise<void>{
        const dataViews: DataView[] = await this.dataViewService.getDataViews(this.dataViewContextName)
        this.allProfiles = await this.profileService.getProfiles()
        this.dataViewMap = this.createDataViewMap(dataViews)
        this.profileCardsArray = this.createProfileCardsArray()
        this.availableProfiles = this.createAvailableProfiles()
    }
    private createDataViewMap(dataViews: DataView[]): Map<number,DataView>{
        try {
            return new Map(dataViews.map(dataView => [dataView.InternalID!, dataView]))
        }catch(err){
            throw new Error(`Error: error occurred while creating the data views map, maybe one of the data views does not have an internalID? :   ${err}`)
        }
    }
    private createProfileCardsArray(): Array<IPepProfileDataViewsCard>{
        const profilesCardsArray: Array<IPepProfileDataViewsCard> = []
        for(const [key, dataView] of this.dataViewMap.entries()){
          profilesCardsArray.push({
            profileId: dataView.Context?.Profile?.InternalID?.toString() || "",
            title: dataView.Context?.Profile?.Name || "",
            dataViews: [
              {
                dataViewId: key.toString(),
                fields: dataView.Fields?.map(field => field.Title) || []
              }
            ]
          })
        }
        return profilesCardsArray
    }
    private createAvailableProfiles(): IPepProfile[]{
        const usedProfilesIDSet = new Set<string | undefined>()
        for(const [id, dataView] of this.dataViewMap.entries()){
          usedProfilesIDSet.add(dataView?.Context?.Profile?.InternalID?.toString())
        }
        return this.allProfiles.filter(profile => !usedProfilesIDSet.has(profile.id))
    }
    async deleteCard(dataViewID: number): Promise<void>{
        const dataView = this.dataViewMap.get(dataViewID)
        if(dataView == undefined || dataView.Context?.Profile?.Name == 'Rep'){
            return
        }
        await this.deleteDataview(dataView)
        this.deleteProfileCard(dataView)
        this.removeDataViewFromDataViewsMap(dataView)
        this.addProfileToAvailableProfiles(dataView)
    }
    private async deleteDataview(dataView: DataView): Promise<void>{
        dataView.Hidden = true
        await this.dataViewService.postDataView(dataView)
    }
    private deleteProfileCard(dataView: DataView): void{
        this.profileCardsArray = this.profileCardsArray.filter(profile => profile.profileId != dataView.Context?.Profile?.InternalID?.toString())
    }
    private removeDataViewFromDataViewsMap(dataView: DataView): void{
        this.dataViewMap.delete(dataView.InternalID || 0)
    }
    private addProfileToAvailableProfiles(dataView: DataView): void{
        this.availableProfiles.push({
            id: dataView.Context?.Profile?.InternalID?.toString() || "",
            name: dataView.Context?.Profile.Name || ""
          })
    }
    editCard(dataViewID: number): void{
        this.currentDataView = this.dataViewMap.get(dataViewID)!
        const mappedFieldsIDSet = new Set<string>()
        const dvColumns: DataViewColumn[] = this.currentDataView['Columns'] || [];
        this.currentMappedFields = this.currentDataView.Fields?.map((field, index) => {
        mappedFieldsIDSet.add(field.FieldID)
        const fieldWidth = dvColumns[index]?.Width;
        return this.fieldConvertor.fieldToMappedField(field, fieldWidth)
        }) || []
        this.currentSideCardsList = this.createSideCardsList(mappedFieldsIDSet)
    }
    private createSideCardsList(mappedFieldsSet: Set<string>): IPepDraggableItem[]{
        const sideCardList: IPepDraggableItem[] = []
        this.fields.forEach(field => {
            if(!mappedFieldsSet.has(field.FieldID)){
                this.addFieldToSideCardsList(field, sideCardList)
            }
        })
        return sideCardList
    }
    private addFieldToSideCardsList(field: any, sideCardList){
        sideCardList.push({
            title: field.Title,
            data: {
                key: field.FieldID,
                ...field
            }
        })

    }
    async createCard(profileID: string, defaultDataView: BaseDataView){
        const repDataView = this.getRepDataView()
        //every card inherit rep props, so we deep copy the props
        let currentDataView = JSON.parse(JSON.stringify(defaultDataView))
        if(repDataView) {
            currentDataView = JSON.parse(JSON.stringify(repDataView))
        }
        const currentProfile = this.availableProfiles.find(profile => profile.id == profileID)
        currentDataView.Context.Profile = {
            InternalID: Number(currentProfile?.id),
            Name: currentProfile?.name
        }
        currentDataView.InternalID = undefined
        const dataView = await this.dataViewService.postDataView(currentDataView)
        this.dataViewMap.set(dataView.InternalID, dataView)
        this.addCardToProfileCardsArray(currentProfile, dataView)
        this.availableProfiles  = this.availableProfiles.filter(profile => profile.id != currentProfile?.id)
    }
    private addCardToProfileCardsArray(profile: IPepProfile | undefined, dataView: DataView){
        if(profile == undefined){
            return 
        }
        this.profileCardsArray.push({
            profileId: profile.id,
            title: profile.name,
            dataViews: [
              {
                dataViewId: dataView?.InternalID?.toString() || "",
                fields: dataView.Fields?.map(field => field.Title) || []
              }
            ]
          })
    }
    private getRepDataView(): DataView | undefined{
        for(const [key,dataView] of this.dataViewMap.entries()){
            if(dataView.Context?.Profile?.Name == 'Rep'){
                return dataView
            }
        }
    }
    getCurrentMappedFields(){
        return this.currentMappedFields
    }
    getCurrentSideCardsList(){
        return this.currentSideCardsList
    }
    dropField(event: CdkDragDrop<IPepDraggableItem[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else if (event.container.id === 'emptyDropArea') {
            this.addNewField(event.previousContainer.data[event.previousIndex], this.currentMappedFields.length);
        } else {
            this.addNewField(event.previousContainer.data[event.previousIndex], event.currentIndex);
        }
    }
    addNewField(draggableItem: IPepDraggableItem, index: number) {
        const mappedField = this.fieldConvertor.draggableItemToMappedField(draggableItem)
        this.currentMappedFields.splice(index, 0, mappedField);
        this.currentSideCardsList = this.currentSideCardsList.filter(field => field.data.FieldID != draggableItem.data.FieldID)
    }
    removeMappedField(mappedFieldID: string){
        const index = this.currentMappedFields.findIndex(ms => ms.field.FieldID === mappedFieldID);
        const field = this.fields.find(field => field.FieldID == this.currentMappedFields[index].field.FieldID)
        // it's possible that the field got deleted from the collection, but still on the DV, in that case, don't add it the side cards.
        if(field) {
            this.addFieldToSideCardsList(field!, this.currentSideCardsList)
        }
        this.currentMappedFields.splice(index, 1);
    }
    async saveCurrentDataView(){
        this.currentDataView.Fields = this.currentMappedFields.map((field, index)=> this.fieldConvertor.mappedFieldToField(field, index))
        if(this.dataViewService.isGridDataView(this.currentDataView)){
            this.currentDataView.Columns = this.getColumnsArray()
        }
        const dataview = await this.dataViewService.postDataView(this.currentDataView)
        this.dataViewMap.set(dataview?.InternalID || 0, dataview)
        const currentCard = this.profileCardsArray.find(card => card.profileId == dataview?.Context?.Profile?.InternalID?.toString())
        currentCard!.dataViews[0].fields = this.currentMappedFields.map(field => field.field.Title)
    }
    getColumnsArray(){
        return this.currentMappedFields.map(mappedField => {
            return {
                Width: mappedField.width
            }
        })
    }
    getAvailableProfiles(){
        return this.availableProfiles
    }
    getProfileCardsArray(){
        return this.profileCardsArray
    }
    getColumnsFromMappedFields(){
        return this.currentMappedFields.map(mappedField =>{
            return { Width: mappedField.width || 0 }
          })
    }
}