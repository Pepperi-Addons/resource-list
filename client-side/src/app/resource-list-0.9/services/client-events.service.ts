import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { loadListEventKey, stateChangeEventKey } from "../metadata";
import { Injectable } from "@angular/core";
import { ListContainer, ListState } from "shared";

@Injectable({ providedIn: 'root' })
export class ClientEventsService{
    constructor(private addonService: PepAddonService){
        
    }
    async emitLoadListEvent(state: Partial<ListState> | undefined ,changes: Partial<ListState>){
        return await this.addonService.emitEvent(loadListEventKey, {State: undefined, Changes: changes}) as ListContainer
    }
    //TODO implement in the future
    async emitOnMenuClickEvent(key: string, data: any){
        console.log('fire menu click event!!')
    }
    async emitStateChangedEvent(state: Partial<ListState>, changes: Partial<ListState>){
        return await this.addonService.emitEvent(stateChangeEventKey, {State: state, Changes: changes}) as ListContainer 
    }
}