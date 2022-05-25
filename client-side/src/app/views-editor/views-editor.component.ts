import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { View } from "../../../../shared/entities"
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';

@Component({
  selector: 'app-views-editor',
  templateUrl: './views-editor.component.html',
  styleUrls: ['./views-editor.component.scss']
})
export class ViewsEditorComponent implements OnInit {
  private key: string
  view: View
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private translate: TranslateService,
    private udcService: UDCService
    ){ 
      this.udcService.pluginUUID = config.AddonUUID
    }

  ngOnInit(): void {
    this.key = this.route.snapshot.paramMap.get('key')
    this.viewsService.getViews(this.key).then(views => {
      this.view = views[0]
      this.initDataSource();
      this.initDataView()
    })

  }
  initDataSource(){
    this.dataSource = {
      Name: this.view.Name,
      Description: this.view.Description,
      Resource: this.view.Resource.Name
    }
  }
  onBackToList(){
    this.router.navigate([".."], { relativeTo: this.route})
  }
  onUpdate(){
    this.view.Name = this.dataSource?.Name
    this.view.Description = this.dataSource?.Description
    this.view.Resource.Name = this.dataSource?.Resource
    this.viewsService.upsertView(this.view)
  }
  async initDataView(){
    this.dataView =  {
      Type: "Form",
      Fields: await this.getFields(),
      Context: {
        Name: "",
        Profile: {},
        ScreenSize: 'Tablet'
      }
    };
    
  }
  async getFields(){
    return [
      {
        ReadOnly: false,
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
        ReadOnly: false,
        Title: this.translate.instant('Resource'),
        Type: 'ComboBox',
        FieldID: "Resource",
        Mandatory: false,
        OptionalValues: await this.getResourcesNames(),
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
      }
    ]
  }
  async getResourcesNames(){
    const resources = await this.udcService.getCollections()
    return resources.map(resource => {
      return {'Key': resource.Name, 'Value': resource.Name}
    })
  }

}
