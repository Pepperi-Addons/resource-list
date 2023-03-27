import { Component, OnInit } from '@angular/core';
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
      Name: "FirstList",
      Resource: "Friends",
      Views: [
          {
              Key: "7debbfa8-a085-11ed-a8fc-0242ac120002",
              Type: "Grid",
              Title: "FirstView",
              Blocks: [
                  {
                      Title: "My name",
                      Configuration: {
                          Type: "TextBox",
                          FieldID: "name",
                          Width: 10
                      },
                      DrawURL: 'addon-cpi/drawGrid',
                      AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                  },
                  {
                      Title: "My age",
                      Configuration: {
                          Type: "NumberInteger",
                          FieldID: "age",
                          Width: 10
                      },
                      DrawURL: 'addon-cpi/drawGrid',
                      AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                  },
              ],
          },
          {
              Key: "17e76a7e-c725-11ed-afa1-0242ac120002",
              Type: "Grid",
              Title: "SecondView",
              Blocks: [
                  {
                      Title: "Second name",
                      Configuration: {
                          Type: "TextBox",
                          FieldID: "name",
                          Width: 10
                      },
                      DrawURL: 'addon-cpi/drawGrid',
                      AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                  },
                  {
                      Title: "Second age",
                      Configuration: {
                          Type: "NumberInteger",
                          FieldID: "age",
                          Width: 10
                      },
                      DrawURL: 'addon-cpi/drawGrid',
                      AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3'
                  },
              ],
          }
      ],
      Menu: {
          Blocks: [
              {
                  Key: 'recycleBin',
                  Title: 'Recycle Bin',
                  DrawURL: 'addon-cpi/drawMenuBlock',
                  AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                  ExecuteURL: 'addon-cpi/menuExecution'
              },
              {
                  Key: 'import',
                  Title: 'Import',
                  DrawURL: 'addon-cpi/drawMenuBlock',
                  AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                  ExecuteURL: 'addon-cpi/menuExecution'
              },
              {
                  Key: 'export',
                  Title: 'Export',
                  DrawURL: 'addon-cpi/drawMenuBlock',
                  AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                  ExecuteURL: 'addon-cpi/menuExecution'
              },
              {
                  Key: 'new',
                  Title: 'New',
                  DrawURL: 'addon-cpi/drawMenuBlock',
                  AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                  ButtonStyleType: "Strong",
                  ExecuteURL: 'addon-cpi/menuExecution'
              }
          ]
      },
      LineMenu: {
          Blocks: [
              {
                  Key: "delete",
                  Title: "Delete",
                  DrawURL: 'addon-cpi/drawLineMenuBlock',
                  AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                  ExecuteURL: 'addon-cpi/menuExecution'
              },
              {
                  Key: "edit",
                  Title: "Edit",
                  DrawURL: 'addon-cpi/drawLineMenuBlock',
                  AddonUUID: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                  ExecuteURL: 'addon-cpi/menuExecution'
              }
          ]
      },
      Search: {
          Fields: [
              {
                  FieldID: "Key"
              },
              {
                  FieldID: "name"
              }
          ]
      },
      SmartSearch: {
          Fields: [
              {
                  FieldID: "name",
                  Title: "name",
                  Type: "String"
              },
              {
                  FieldID: "age",
                  Title: "name",
                  Type: "String"
              }
          ]
      },
      SelectionType: "Multi",
      Sorting: {Ascending: false, FieldID: "name"}
    },
    State: {
      ListKey: "LIST_KEY",
      SearchString: "WOHOOOOO!!!"
    }
  }

  constructor(public clientEventService: ClientEventsService) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
  }

}
