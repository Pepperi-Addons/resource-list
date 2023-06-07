import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { List, ListContainer } from 'shared';
import { ClientEventsService, ICPIEventsService } from '../services/client-events.service';

@Component({
  selector: 'list-page-block',
  templateUrl: './list-page-block.component.html',
  styleUrls: ['./list-page-block.component.scss']
})

export class ListPageBlockComponent implements OnInit {
    listContainer: ListContainer = {
        List: {
          Key: "LIST_KEY",
          Name: "Accounts list",
          Resource: "accounts",
          Views: [
              {
                  Key: "7debbfa8-a085-11ed-a8fc-0242ac120002",
                  Type: "Grid",
                  Title: "FirstView",
                  Blocks: [
                      {
                          Title: "Name",
                          Configuration: {
                              Type: "TextBox",
                              FieldID: "Name",
                              Width: 10
                          },
                          DrawURL: 'addon-cpi/drawGrid',
                          AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                      },
                      {
                          Title: "ERP Code",
                          Configuration: {
                              Type: "TextBox",
                              FieldID: "ExternalID",
                              Width: 10
                          },
                          DrawURL: 'addon-cpi/drawGrid',
                          AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                      },
                      {
                          Title: "email",
                          Configuration: {
                              Type: "TextBox",
                              FieldID: "Email",
                              Width: 10
                          },
                          DrawURL: 'addon-cpi/drawGrid',
                          AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                      },
                  ],
              }
          ],
          Search: {
              Fields: [
                  {
                      FieldID: "Name"
                  },
                  {
                      FieldID: "Email"
                  },
                  {
                      FieldID: "ExternalID"
                  }
              ]
          },
          SmartSearch: {
              Fields: [
                  {
                      FieldID: "Name",
                      Title: "name",
                      Type: "String"
                  },
                  {
                      FieldID: "ExternalID",
                      Title: "externalID",
                      Type: "String"
                  }
              ]
          },
          SelectionType: "Multi",
          Sorting: {Ascending: true, FieldID: "ExternalID"},
          Menu: {
            Blocks: []
          },
          LineMenu: {
            Blocks: [
                {
                    Key: 'edit',
                    AddonUUID: "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3",
                    DrawURL: "addon-cpi/drawEditLineMenuBlock",
                    ExecuteURL: "addon-cpi/menuExecution",
                    Title: 'Edit'
                }
            ]
          }
        },
        State: {
          ListKey: "LIST_KEY",
       
        }
    }

  listABICompRef: MatDialogRef<any,any>

  constructor(public clientEventService: ClientEventsService, private addonBlockService: PepAddonBlockLoaderService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
  }

  onClick(){
    const hostObject = {
      listContainer: this.listContainer,
      inDialog: true
    }
    this.listABICompRef = this.addonBlockService.loadAddonBlockInDialog({
        name: 'List',
        hostObject: hostObject,

        container: this.viewContainerRef,
        hostEventsCallback: (event) => {
            switch (event.action) {
                case 'on-done': {
                    console.log(JSON.stringify(event.data));
                    break;
                }
                case 'on-cancel': {
                    // there is nothing to do here other than closing the dialog
                    break;
                }
                default: {
                    console.error(`action ${event.action} is not supported`);
                }
            }
            this.listABICompRef.close();
        }
    })
    
  }

}
