import { Component, OnInit } from '@angular/core';
import { ClientEventsService } from '../services/client-events.service';
import { ViewBlocksAdapter } from '../helpers/view-blocks-adapter';

@Component({
  selector: 'resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {

  constructor(private clientEventService: ClientEventsService) { }

  ngOnInit(): void {
    this.init()
  }
  
  async init(){
    const result  =  await this.clientEventService.emitLoadListEvent("LIST_KEY")
    debugger

  }

}
