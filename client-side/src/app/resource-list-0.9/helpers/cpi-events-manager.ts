import { ClientEventsService } from "../services/client-events.service";
import { StateManager } from "./state-manager";

/**
 * this class responding to events from the client component such as onDataSourceInit, onMenuClicked and so on..
 * this class will respond to this events by emitting events to the cpi side and adapt the result.
 * this class will also hold state manager in order to send the cpi side events the state changes
 */
export class CPIEventsManager{
    constructor(private clientEventsService: ClientEventsService, private stateManager: StateManager){
    
    }

}