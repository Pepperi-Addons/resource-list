import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../addon.config';
import { IDataService } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {
  dataSource = {
    Name: "",
    Description: "",
    Resource: undefined
  }
  dataView: any = {
    Type: "Form",
    Fields: [],
    Context: {
      Name: "",
      Profile: {},
      ScreenSize: 'Tablet'
    }
  };
  isValid: boolean = false
  service: IDataService
  resources: any[]
  title: string



  constructor(
    @Inject(MAT_DIALOG_DATA) public incoming: any,
    private dialogRef: MatDialogRef<AddFormComponent>,
    private translate: TranslateService,
    private genericResourceService: GenericResourceService)
  {
  } 

  ngOnInit(): void {
    this.service = this.incoming.service
    this.title = this.translate.instant('Add' + this.incoming.service.name)
    this.service.getResources().then(resources => {
      this.resources = resources
      const resourcesNames = this.getResourcesNames(resources)
      this.dataView ={
        Type: "Form",
        Fields: this.getDataViewFields(resourcesNames),
        Context: {
          Name: "",
          Profile: {},
          ScreenSize: 'Tablet'
        }
      }
    })
  }

  getResourcesNames(resources: any[]){
    return resources.map(resource => {
        return {Key: resource.Name, Value: resource.Name}
    })
  }

  getDataViewFields(resourcesNames){
    return [
      {
      ReadOnly: false,
      Title: this.translate.instant('Name'),
      Type: 'TextBox',
      FieldID: "Name",
      Mandatory: true,
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
            X: 0,
            Y: 1
          },
          Size: {
            Width: 1,
            Height: 0
          }
      }
      },
      {
      ReadOnly: false,
      Title: this.translate.instant('Resource'),
      Type: 'ComboBox',
      FieldID: "Resource",
      Mandatory: true,
      OptionalValues: resourcesNames,
      Layout: {
          Origin: {
            X: 0,
            Y: 2
          },
          Size: {
            Width: 1,
            Height: 0
          }
      }
      }
  ]
  }
  async onSave(){
    const resource = this.resources.find(resource => resource.Name == this.dataSource.Resource)
    const field = {
      Name: this.dataSource.Name,
      Description: this.dataSource.Description,
      Resource: {
        Name: this.dataSource.Resource,
        AddonUUID: resource.AddonUUID
      }
    }
    const result = await this.service.upsertItem(field)
    this.dialogRef.close(result)
    
  }
  onCancel(){
    this.dialogRef.close();
  }

}
