import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PepJwtHelperService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PepDialogActionsType, PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { PapiClient } from "@pepperi-addons/papi-sdk";


@Injectable({ providedIn: 'root' })
export class UtilitiesService{
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

    showDialog(title: string, content: string, actionsType: PepDialogActionsType){
        const dataMsg = new PepDialogData({
          title: this.translate.instant(title),
          actionsType: actionsType,
          content: this.translate.instant(content)
        });
        this.dialogService.openDefaultDialog(dataMsg)
    }
    isDataViewFieldOfPrimitiveTypeArray(){
        
    }


}