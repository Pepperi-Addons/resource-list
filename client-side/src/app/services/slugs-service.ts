import { Injectable } from "@angular/core";
import { PepJwtHelperService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { SLUGS_UUID } from "../addon.config";


@Injectable({ providedIn: 'root' })
export class SlugsService{
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
    async getSlugs(){
        return await this.papiClient.addons.api.uuid(SLUGS_UUID).file('api').func('slugs').get()
    }
}