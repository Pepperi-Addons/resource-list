import { Injectable } from "@angular/core";
import { PepJwtHelperService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { UtilitiesService } from './utilities-service'



@Injectable({ providedIn: 'root' })
export class ProfileService{
    pluginUUID;
    constructor(
        private utilitiesService: UtilitiesService,
    ){}

    async getProfiles(){
        const profiles =  await this.utilitiesService.papiClient.profiles.find()
        return profiles.map(profile => {
            return {
                id: profile.InternalID.toString(),
                name: profile.Name || ""
            }
        })
    }
}