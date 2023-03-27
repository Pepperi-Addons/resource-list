import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PepJwtHelperService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { config } from "../../addon.config";

@Injectable({ providedIn: 'root' })
export class ResourceService{
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
        public jwtService: PepJwtHelperService,
        private translate: TranslateService,
        private dialogService: PepDialogService
    ){
        const accessToken = this.session.getIdpToken();
        this.parsedToken = jwtService.decodeToken(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"]
    }

    async getResourceFields(resourceName: string){
        return await this.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('get_resource_fields').get({Name: resourceName})
    }
}