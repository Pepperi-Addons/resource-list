import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { loadListEventKey } from "../metadata";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ClientEventsService{
    constructor(private addonService: PepAddonService){
        
    }
    async emitLoadListEvent(key: string){
        return await this.addonService.emitEvent(loadListEventKey, {State: undefined, Changes: {ListKey: key}})
    }
}