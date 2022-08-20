import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { GenericResourceService } from '../services/generic-resource-service';
import { config } from '../addon.config';
import { View } from '../../../../shared/entities';
import { EditorsService } from '../services/editors.service';
import { UtilitiesService } from '../services/utilities-service';

@Component({
  selector: 'app-views-form',
  templateUrl: './views-form.component.html',
  styleUrls: ['./views-form.component.scss']
})

export class ViewsFormComponent implements OnInit {
  dataSource: any = {}
  dataView: any = {
    Type: "Form",
    Fields: [],
    Context: {
      Name: "",
      Profile: {},
      ScreenSize: 'Tablet'
    }
  };
  resourceName: string
  dataViewContextName: string
  editCard: boolean = false;
  currentTabIndex = 0;
  viewKey: string
  currentView: View
  loadCompleted: boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private genericResourceService: GenericResourceService,
    private editorsService: EditorsService,
    private utilitiesService: UtilitiesService
    ){ 
    }
    
  ngOnInit(): void {
    this.initComponent()
  }
  async initComponent(){
    this.viewKey = this.route.snapshot.paramMap.get('key')
    await this.initGeneralTab(this.viewKey)
    this.loadCompleted = true
  }
  async initGeneralTab(key){
    this.currentView = (await this.viewsService.getItems(key))[0]    
    const editorOptionalValues = await this.getEditorOptionalValues()
    this.dataSource = this.convertViewToDataSource(this.currentView)
    this.dataView = this.getDataview(editorOptionalValues)
  }
  async getEditorOptionalValues(){
    const editors = await this.editorsService.getItems()
    const editorsOfCurrentView = editors.filter((editor) => editor.Resource.Name == this.currentView.Resource.Name)
    return editorsOfCurrentView.map(editor => {
      return {
        Key: editor.Key,
        Value: editor.Name
      }
    })
  }
  convertViewToDataSource(view: View){
    return {
      Name: view.Name,
      Description: view.Description,
      Resource: view.Resource.Name,
      Editor: view.Editor
    }
  }
  getDataview(editorOptionalValues){
    return  {
      Type: "Form",
      Fields: this.getDataViewFields(editorOptionalValues),
      Context: {
        Name: "",
        Profile: {},
        ScreenSize: 'Tablet'
      }
    }
  }
  getDataViewFields(editorsOptoinalValues){
    return [
      {
      ReadOnly: true,
      Title: this.translate.instant('Name'),
      Type: 'TextBox',
      FieldID: "Name",
      Mandatory: false,
      Layout: {
          Origin: {
          X: 0,
          Y:0
          },
          Size: {
          Width: 1,
          Height: 0
          }
      }
      },
      {
      ReadOnly: false,
      Title: this.translate.instant('Description'),
      Type: 'TextBox',
      FieldID: "Description",
      Mandatory: false,
      Layout: {
          Origin: {
          X: 1,
          Y: 0
          },
          Size: {
          Width: 1,
          Height: 0
          }
      }
      },
      {
      ReadOnly: true,
      Title: this.translate.instant('Resource'),
      Type: 'TextBox',
      FieldID: "Resource",
      Mandatory: false,
      Layout: {
          Origin: {
          X: 0,
          Y:1
          },
          Size: {
          Width: 1,
          Height: 0
          }
      }
      },
      {
        ReadOnly: editorsOptoinalValues.length == 0,
        Title: this.translate.instant('Editor'),
        Type: 'ComboBox',
        FieldID: "Editor",
        Mandatory: false,
        OptionalValues: editorsOptoinalValues,
        Layout: {
            Origin: {
            X: 1,
            Y:1
            },
            Size: {
            Width: 1,
            Height: 0
            }
        }
        }
    ]
  }
  onBackToList(){
    this.router.navigate([".."], {
      relativeTo: this.route
    })
  }
  onUpdate(){
    this.currentView.Description = this.dataSource.Description
    this.currentView.Editor = this.dataSource.Editor
    this.viewsService.upsertItem(this.currentView)
    this.utilitiesService.showDialog("Update", "UpdateDialogMSG", 'close')
  }
}
