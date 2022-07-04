import { global } from '@angular/compiler/src/util';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPepProfile, IPepProfileDataViewsCard } from '@pepperi-addons/ngx-lib/profile-data-views-list';
import { DataView } from '@pepperi-addons/papi-sdk';
import { DataViewService } from '../services/data-view-service';
import { ProfileService } from '../services/profile-service';

@Component({
  selector: 'app-profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent implements OnInit {
  @Input() dataViewContextName: string
  @Input() resourceName: string
  @Input() private dataViewsMap: Map<string, DataView>
  @Output() private editCardEvent = new EventEmitter<any>()
  profileCardsArray: Array<IPepProfileDataViewsCard> = [];
  private allProfiles: IPepProfile[] = []
  availableProfiles: Array<IPepProfile> = [];
  private repDataviewID: string
  defaultProfileId: number = 0


  constructor(private profileServce: ProfileService, 
    private dataViewService: DataViewService){
  }
  //------------------------------------------------------------------------------------------------------
  //------------------------------------------- Init Functions -------------------------------------------
  //------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    Promise.all([this.profileServce.getProfiles(), this.dataViewService.getDataViews(this.dataViewContextName)])
    .then(([profiles, dataViews]) => {
      this.allProfiles = profiles
      this.initDataViewsMap(dataViews)
      this.availableProfiles = this.getAvilableProfilesArray(this.allProfiles, this.dataViewsMap)
      this.profileCardsArray = this.getProfileCardsArray(this.dataViewsMap)
    })
  }
  initDataViewsMap(dataViews : DataView[]){
    dataViews.forEach(dataview => {
      if(dataview.Context?.Profile?.Name == 'Rep'){
        this.repDataviewID = dataview.InternalID?.toString()|| ""
      }
      this.dataViewsMap.set(dataview.InternalID.toString(), dataview)
    })
  }
  getAvilableProfilesArray(allProfiles: Array<IPepProfile> , dataViewsMap: Map<string, DataView>): Array<IPepProfile>{
    const usedProfilesIDSet = new Set<string>()
    for(const [id, dataView] of this.dataViewsMap.entries()){
      usedProfilesIDSet.add(dataView?.Context?.Profile?.InternalID?.toString())
    }
    return allProfiles.filter(profile => !usedProfilesIDSet.has(profile.id))
  }
  getProfileCardsArray(dataViewsMap: Map<string, DataView>): Array<IPepProfileDataViewsCard>{
    const profilesCardsArray: Array<IPepProfileDataViewsCard> = []
    for(const [key, dataView] of dataViewsMap.entries()){
      profilesCardsArray.push({
        profileId: dataView.Context.Profile.InternalID.toString(),
        title: dataView.Context.Profile.Name,
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

  //------------------------------------------------------------------------------------------------------
  //------------------------------------------- Cards Actions --------------------------------------------
  //------------------------------------------------------------------------------------------------------
  //remove profile card from the page
  onDataViewDeleteClicked($event){
    const currentDataView = this.dataViewsMap.get($event.dataViewId)
    if(currentDataView.Context.Profile.Name == 'Rep'){
      return
    }
    currentDataView.Hidden = true
    this.dataViewService.postDataView(currentDataView)
    this.profileCardsArray = this.profileCardsArray.filter(profile => profile.profileId != currentDataView.Context.Profile.InternalID.toString())
    this.dataViewsMap.delete(currentDataView.InternalID.toString())
    this.availableProfiles.push({
      id: currentDataView.Context.Profile.InternalID.toString(),
      name: currentDataView.Context.Profile.Name
    })
  }

  onDataViewEditClicked($event){
    const currentDataView = this.dataViewsMap.get($event.dataViewId)
    const currentProfileCard = this.profileCardsArray.find(
      profileCard => profileCard.profileId == currentDataView.Context.Profile.InternalID.toString())
    this.editCardEvent.emit({card: currentProfileCard, dataview: currentDataView})
  }

  async onSaveNewProfileClicked($event){
    const repDataview = this.dataViewsMap.get(this.repDataviewID)
    //to deep copy the object!
    const currentDataView = JSON.parse(JSON.stringify(repDataview))
    const profile = this.availableProfiles?.find(profile => profile.id == $event)
    currentDataView.Context.Profile = {
      InternalID: Number(profile.id),
      Name: profile.name
    }
    currentDataView.InternalID = undefined
    const dataView = await this.dataViewService.postDataView(currentDataView)
    this.dataViewsMap.set(dataView.InternalID.toString(), dataView)
    this.profileCardsArray.push({
      profileId: profile.id,
      title: profile.name,
      dataViews: [
        {
          dataViewId: dataView.InternalID.toString(),
          fields: dataView.Fields?.map(field => field.Title) || []
        }
      ]
    })
    this.availableProfiles = this.availableProfiles.filter(availableProfile => availableProfile.id != profile.id)
  }
}
