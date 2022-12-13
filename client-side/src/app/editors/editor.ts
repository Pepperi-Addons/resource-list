import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { View, Editor } from 'shared';
import { IDataService } from '../metadata';
import { GenericResourceService } from '../services/generic-resource-service'

export abstract class AbstractEditor{
    key: string
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
        private genericResourceService: GenericResourceService,
        protected service: IDataService,
        ){ 
        }
    async init(key){
        await this.initView(key)
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
        const resources = await this.genericResourceService.getResources()
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
    getName(){
        return this.content.Name
    }
}