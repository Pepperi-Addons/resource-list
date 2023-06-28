import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { config } from '../addon.config';
import { DRILL_DOWN_EVENT_KEY } from '../metadata';
import { LOAD_EVENT_KEY } from 'shared';

@Component({
  selector: 'views-events-tab',
  templateUrl: './views-events-tab.component.html',
  styleUrls: ['./views-events-tab.component.scss']
})
export class ViewsEventsTabComponent implements OnInit, AfterViewInit {
  @ViewChild('eventsABIContainer', { static: false, read: ViewContainerRef }) eventsABIContainer: ViewContainerRef;
  @Input() isDrillDown = false
  @Output() drillDownChangedEvent: EventEmitter<boolean> = new EventEmitter()
  @Input() viewKey: string = ""

  constructor(
    private addonBlockService: PepAddonBlockLoaderService,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(){
    this.loadEventsABI()
  }

  loadEventsABI(){
    this.eventsABIContainer.clear()
    this.addonBlockService.loadAddonBlockInContainer({
      container: this.eventsABIContainer,
      name: 'UserDefinedEvents',
      hostObject: this.getHostObjectForEventsABI(),
      hostEventsCallback: (event) => console.log(`${event}`)
    })
  }

  onIsDrillDownChanged(){
    this.drillDownChangedEvent.emit(this.isDrillDown)
  }

  getHostObjectForEventsABI(){
    return {
      AddonUUID: config.AddonUUID,
      Name: this.viewKey,
      PossibleEvents: [
        {
          Title: 'First Field Drill Down',
          EventKey: DRILL_DOWN_EVENT_KEY,
          EventData: {
              ObjectKey: {
                Type: "String"
              },
              ViewKey: {
                Type: "String"
              },
              ResourceKey: {
                Type: "String"
              }
          },
          EventFilter: {
            ViewKey: this.viewKey
          }
        },
        {
          Title: 'List load',
          EventKey: LOAD_EVENT_KEY,
          EventData: {
              ResourceName: {
                Type: "String"
              }
          },
          EventFilter: {
            ViewKey: this.viewKey
          }
        }
      ]
    }
  }

}
