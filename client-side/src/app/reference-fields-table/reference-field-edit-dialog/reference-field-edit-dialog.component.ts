import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { GenericFormComponent } from '@pepperi-addons/ngx-composite-lib/generic-form';
import { SELECTION_TYPE } from 'src/app/metadata';
import { GenericResourceService } from 'src/app/services/generic-resource-service';
import { ViewsService } from 'src/app/services/views.service';
import {  DROP_DOWN, SELECTION_LIST, View } from '../../../../../shared/entities';

@Component({
  selector: 'block-reference-field-edit-dialog',
  templateUrl: './reference-field-edit-dialog.component.html',
  styleUrls: ['./reference-field-edit-dialog.component.scss']
})
export class ReferenceFieldEditDialogComponent implements OnInit {
  title: string
  dataSource
  dataView
  isValid: boolean = false
  referenceField
  resourceName: string
  isLoaded = false
  selectionListsDropDown: {Key: string, Value: string}[] = []
  @ViewChild(GenericFormComponent) genericForm  
  constructor(
    @Inject(MAT_DIALOG_DATA) public incoming: any,
    private dialogRef: MatDialogRef<ReferenceFieldEditDialogComponent>,
    private translate: TranslateService,
    private viewsService: ViewsService,
    private genericResourceService: GenericResourceService
  ) { }

  ngOnInit(): void {
    this.init()
  }
  private async init(){
    //I'm using the spread operator in order to deep copy the *non-nested* object
    this.dataSource = this.incoming.item
    this.resourceName = this.incoming.item.Resource
    this.selectionListsDropDown = await this.getSelectionLists()
    this.dataView = await this.getDataView()
    this.isLoaded = true
  }
  private async getDataView(){
    return {
      Type: "Form",
      Fields: await this.getFields(),
      Context: {
        Name: "",
        Profile: {},
        ScreenSize: 'Tablet'
      }
    }
  }
  private async getDisplayFields(){
    const resourceFields = (await this.genericResourceService.getResource(this.resourceName))?.Fields
    return this.convertResourceFieldsToDropDown(resourceFields)
  }
  convertResourceFieldsToDropDown(resourceFields){
    return Object.keys(resourceFields).map(fieldID => {
      return {
        Key: fieldID,
        Value: fieldID
      }
    })
  }
  private async getFields(){
    return [
      {
        ReadOnly: false,
        Title: this.translate.instant('DisplayField'),
        Type: 'ComboBox',
        FieldID: "DisplayField",
        OptionalValues: await this.getDisplayFields(),
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
        Title: this.translate.instant('SelectionType'),
        Type: 'ComboBox',
        FieldID: "SelectionType",
        Mandatory: true,
        OptionalValues: this.getSelectionTypes(),
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
        ReadOnly: !(this.dataSource.SelectionType == SELECTION_LIST),
        Title: this.translate.instant('SelectionList'),
        Type: 'ComboBox',
        FieldID: "SelectionList",
        OptionalValues: this.selectionListsDropDown,
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
    ]
  }
  private async getSelectionLists(){
    const views = await this.viewsService.getItems()
    const viewsOfResource = views.filter(view => view.Resource.Name == this.resourceName)
    return this.getDropDownOfViews(viewsOfResource)
  } 
  private getDropDownOfViews(views: View[]){
    return views.map(view => {
      return {
        Key: view.Key,
        Value: view.Name
      }
    })
  }

  private getSelectionTypes(){
    return [
      {
        Key: DROP_DOWN,
        Value: this.translate.instant(DROP_DOWN)
      },
      {
        Key: SELECTION_LIST ,
        Value: this.translate.instant(SELECTION_LIST)
      }
    ]
  }

  onCancel(){
    this.dialogRef.close()
  }
  onSave(){
    this.dialogRef.close(this.dataSource)
  }
  valueChange($event){
    if($event.ApiName == SELECTION_LIST){
      const selectionList = this.selectionListsDropDown?.find(selectionList => selectionList.Key == $event.Value)
      this.dataSource.SelectionList = selectionList.Value
      this.dataSource.SelectionListKey = selectionList.Key
    }
    if($event.ApiName == SELECTION_TYPE){
      this.dataView.Fields[2].ReadOnly = !($event.Value == SELECTION_LIST)
    }
    //WORKAROUND - generic from updated only when a new reference to the dataview is created!!!
    this.dataView = JSON.parse(JSON.stringify(this.dataView))
  }
  onValidtation(event){
    this.isValid = event
  }
}
