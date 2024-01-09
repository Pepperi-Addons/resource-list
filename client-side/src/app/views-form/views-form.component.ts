import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { GenericResourceService } from '../services/generic-resource-service';
import { SelectOption, View } from 'shared';
import { EditorsService } from '../services/editors.service';
import { UtilitiesService } from '../services/utilities-service';
import { AddonData, AddonDataScheme, SchemeField } from '@pepperi-addons/papi-sdk';
import { ResourceField } from '../metadata';
import { KeyValuePair } from '@pepperi-addons/ngx-lib';

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
  @ViewChild('views-filter') viewsFilter
  resourceName: string
  dataViewContextName: string
  editCard: boolean = false;
  currentTabIndex = 0;
  viewKey: string
  currentView: View
  loadCompleted: boolean = false
  currentTab = 0
  resourceFields : AddonDataScheme['Fields']
  searchFields : AddonDataScheme['Fields']
  indexedFields: ResourceField[]
  initialFilter: any
  currentFilter: any
  isJsonFilterFileValid: boolean = true
  offlineResource: boolean = true
  sortingOptions = [];

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

  onJsonFilterFileChanged(file: any){
    this.currentFilter = file
  }
  onJsonFileValidationChanged(isValid: boolean){
    this.isJsonFilterFileValid = isValid
  }
  onIsDrillDownChanged(event){
    this.currentView.isFirstFieldDrillDown = event
  }

  
  async initComponent(){
    this.viewKey = this.route.snapshot.paramMap.get('key')
    await this.initGeneralTab(this.viewKey)
    this.loadCompleted = true
  }
  async initGeneralTab(key){
    this.currentView = (await this.viewsService.getItems(key))[0]
    this.initialFilter = this.currentView.Filter 
    this.currentFilter = this.currentView.Filter 
    this.resourceFields = await this.genericResourceService.getResourceFields(this.currentView.Resource.Name);
    this.searchFields = await this.genericResourceService.getResrourceSearchFields(this.currentView.Resource.Name);
    this.indexedFields = this.getIndexedFieldsArray(this.resourceFields)    
    this.sortingOptions = this.getFields();
    this.sortingOptions.push({
      Key: "CreationDateTime",
      Value: this.translate.instant("CreationDateTime")
    })
    const editorOptionalValues = await this.getEditorOptionalValues()
    this.dataSource = this.convertViewToDataSource(this.currentView)
    this.dataView = this.getDataview(editorOptionalValues)
  }

  getIndexedFieldsArray(fields: AddonDataScheme['Fields']): ResourceField[]{
    const result: ResourceField[] = []
    Object.keys(fields || {}).forEach((fieldID) => {
      const field = fields[fieldID]
      if(field?.Indexed){
        result.push({
          FieldID: fieldID,
          ...field
        })
      }
    })
    return result
  }

  getFields(): KeyValuePair<string>[]{
    const res: KeyValuePair<string>[] = [];
    this.indexedFields.forEach(indexedField => {
      res.push({
        Key: indexedField.FieldID,
        Value: indexedField.FieldID
      })

      if(indexedField.IndexedFields) {
        Object.keys(indexedField.IndexedFields || {}).forEach(fieldName => {
          res.push({
            Key: `${indexedField.FieldID}.${fieldName}`,
            Value: `${indexedField.FieldID}.${fieldName}`
          })
        })
      }
    })

    return res;
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
  onTabChanged(event){
    this.currentTab = event.index
  }
  convertViewToDataSource(view: View){
    return {
      Name: view.Name,
      Description: view.Description,
      Resource: view.Resource.Name,
      Editor: view.Editor,
      SortingField: view.Sorting?.FieldKey || 'CreationDateTime',
      Ascending: view.Sorting?.Ascending || false
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
      },
      {
        ReadOnly: this.sortingOptions.length == 0,
        Title: this.translate.instant('Default Sorting'),
        Type: 'ComboBox',
        FieldID: "SortingField",
        Mandatory: false,
        OptionalValues: this.sortingOptions,
        Layout: {
            Origin: {
            X: 0,
            Y:2
            },
            Size: {
            Width: 1,
            Height: 0
            }
        },
        AdditionalProps: {
          emptyOption: false
        }
      },
      {
        ReadOnly: this.sortingOptions.length == 0,
        Title: this.translate.instant('Ascending'),
        Type: 'Boolean',
        FieldID: "Ascending",
        Mandatory: false,
        Layout: {
            Origin: {
            X: 1,
            Y:2
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
    //filters is or undefined or and object with some properties, if the object is empty so we want to save the filter as null
    this.currentView.Filter = this.currentFilter && Object.keys(this.currentFilter).length == 0 ? undefined: this.currentFilter
    this.currentView.Description = this.dataSource.Description
    this.currentView.Editor = this.dataSource.Editor;
    if (this.dataSource.SortingField) {
      this.currentView.Sorting = {
        FieldKey: this.dataSource.SortingField,
        Ascending: this.dataSource.Ascending.toString().toLocaleLowerCase() === 'true'
      }
    }
    else {
      this.currentView.Sorting = undefined;
    }
    this.viewsService.upsertItem(this.currentView)
    this.utilitiesService.showDialog("Update", "UpdateDialogMSG", 'close')
  }
}
