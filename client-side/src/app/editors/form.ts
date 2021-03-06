import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { View, Editor } from '../../../../shared/entities';
import { IDataService } from '../metadata';

export abstract class AbstractForm{
    dataSource: any
    dataView: any = {
        Type: "Form",
        Fields: [],
        Context: {
          Name: "",
          Profile: {},
          ScreenSize: 'Tablet'
        }
    }
    abstract content: View | Editor
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private udcService: UDCService,
        protected service: IDataService,
        ){ 
          this.udcService.pluginUUID = config.AddonUUID
        }
    async init(){
        await this.initView(this.route.snapshot.paramMap.get('key'))
        this.initDataSource();
        await this.initDataView()
    }
    abstract initView(key: string):Promise<any>;

    initDataSource(){
        this.dataSource = {
            Name: this.content.Name,
            Description: this.content.Description,
            Resource: this.content.Resource.Name
          }
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
            ReadOnly: false,
            Title: this.translate.instant('Resource'),
            Type: 'ComboBox',
            FieldID: "Resource",
            Mandatory: true,
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
    getDataSource(){
        return this.dataSource
    }
    getDataView(){
        return this.dataView
    }
    abstract update()
    getName(){
        return this.content.Name
    }
}