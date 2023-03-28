import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListContainer } from 'shared';
import { ClientEventsService } from '../services/client-events.service';

@Component({
  selector: 'list-abi',
  templateUrl: './list-abi.component.html',
  styleUrls: ['./list-abi.component.scss']
})

export class ListAbiComponent implements OnInit {
  @Input() hostObject: any;
  @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

  constructor(public clientEventsService: ClientEventsService) { }

  ngOnInit(): void {
    this.clientEventsService = this.hostObject.cpiEventService || this.clientEventsService
    this.validateListContainer(this.hostObject.listContainer)
  }
  validateListContainer(listContainer: ListContainer){
    if(!listContainer || !listContainer.State || !listContainer.State.ListKey){
      throw Error(`inside LIST ABI - problem with list container in the host object, list container must be exist and includes state with list key as property`)  
    }
  }

}
