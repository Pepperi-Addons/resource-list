import { Injectable } from "@angular/core";
import { PepJwtHelperService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";


@Injectable({ providedIn: 'root' })
export class UDCService{
    accessToken = '';
    parsedToken: any
    papiBaseURL = 'https://staging.pepperi.com'
    pluginUUID;
    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.session.getIdpToken(),
            addonUUID: this.pluginUUID,
            suppressLogging:true
        })
    }
    constructor(
        public session:  PepSessionService,
        public jwtService: PepJwtHelperService
    ){
        const accessToken = this.session.getIdpToken();
        this.parsedToken = jwtService.decodeToken(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"]
    }

    async getCollections(): Promise<any[]>{
        return await this.papiClient.addons.api.uuid(this.pluginUUID).file('api').func('get_all_collections').get()
    }
    async getAllResources(resourceType: string){
        if(resourceType == 'UDC'){
            return await this.getCollections()
        }
    }
    async getItems(resourceName: string){
        if(resourceName){
            return await this.papiClient.userDefinedCollections.schemes.name(resourceName).get();
        }
        return [];
    }
}