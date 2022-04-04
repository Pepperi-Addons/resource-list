import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockEditorService } from './block-editor.service'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ICardEditor, IContent, IContentEditor } from '../draggable-card-fields/cards.model'
import { CardsService } from '../draggable-card-fields/cards.service'
import { Resource } from '../resources/resource'
import { CollectionResource } from '../resources/collection-resource'

interface ResourceMap{
    [key:string]:Resource
}

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})

export class BlockEditorComponent implements OnInit {
    resourcesNames:  {key:string, value:string}[] = []
    resources: any[]
    fieldsKeys: string[] = []
    choosenResource: {'key': string, 'value': string}
    resourcesMap:ResourceMap = {}
    currentResourceName: string
    currentResource: Resource
    title: string
    fields: string[]
    allowExport: boolean = false;
    allowImport: boolean = false;
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    currentCardindex: number;
    filteredFields: any[]
    private _configuration: IContent;
    public currentCardsList: ICardEditor[] = []
    get configuration(): IContent {
        return this._configuration;
    }
    constructor(private translate: TranslateService,
                private blockEditorService: BlockEditorService,
                private cardsService: CardsService
               ) {
    }
    ngOnInit(): void {
        for(let key in this.hostObject.configuration.resourcesMap){
            this.hostObject.configuration.resourcesMap[key] = undefined
        }
        this.hostObject.configuration.currentResource = undefined
        this.title = this.hostObject?.configuration?.title
        this.allowExport = this.hostObject?.configuration?.allowExport
        this.allowImport = this.hostObject?.configuration?.allowImport
        this.blockEditorService.pluginUUID = "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
        this.currentResource = this.hostObject?.configuration?.currentResource
        this.currentResourceName = this.hostObject?.configuration?.currentResourceName
        this.blockEditorService.getCollections().then(resources => {
            this.resources = resources
            resources.map(resource => {
                this.resourcesNames.push({key: resource.Name, value: resource.Name})  
            })
        })
        .then(() => {
            this.initResourceMap()
            return this.initResources() 
        })
        .then(() => {
            this.setCurrentResource()
            this.currentCardsList = this.currentResource? this.currentResource.cardsList : []
            debugger
            this.fieldsKeys = this.currentResource? this.currentResource.getFieldsKeys(): []
        })
    }
    async initResources(){
        await Promise.all(this.resources.map(resource => {
            if(!this.resourcesMap[resource.Name].isInitillized){
                return this.resourcesMap[resource.Name].init()
            }
        }))
    }
    setCurrentResource(){
        let currentResource = this.hostObject?.configuration?.currentResource
        let currentResourceName = this.hostObject?.configuration?.currentResourceName
        if(!currentResource){
            currentResource = this.resources.length > 0? this.resourcesMap[this.resources[0].Name] : undefined
            currentResourceName = currentResource?.resourceName
        }
        this.currentResource = currentResource
        this.currentResourceName = currentResourceName
    }
    //happen after init the resurcesNames
    initResourceMap(){
        const tempMap: ResourceMap = {}
        let resourcesMap = this.hostObject?.configuration?.resourcesMap 
        resourcesMap = resourcesMap? resourcesMap: {}
        const resources = this.resources.map((resource) => {
           let val = resourcesMap[resource.Name] 
           if(!val){
            val = new CollectionResource(resource, this.blockEditorService)
           }
           return val
        })
        resources.map((resource) => {
            tempMap[resource.resourceName] = resource
        })
        this.resourcesMap = tempMap
        this.updateConfigurationObjectField('resourcesMap', this.resourcesMap)
    }
    getResourceByName(name: string){
        return this.resources?.find((resource) => resource.Name == name)
    }
    private updateConfigurationObjectField(key: string, value: any) {
        const hostObjectConfiguration = this.hostObject?.configuration
        if(hostObjectConfiguration){
            hostObjectConfiguration[key] = value
        }
    }
    private updateHostObject() {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }
    onAllowExportChange($event){
        this.allowExport = $event
        // this.updateConfigurationObject()
        this.updateConfigurationObjectField('allowExport', this.allowExport)
    }
    onAllowImportChange($event){
        this.allowImport = $event
        // this.updateConfigurationObject()
        this.updateConfigurationObjectField('allowImport', this.allowImport)
    }
    onTitleChanged($event):void{
        this.title = $event;
        // this.updateConfigurationObject()
        this.updateConfigurationObjectField('title', this.title)
    }
    onResourceChanged($event):void{
        this.currentResourceName = $event
        this.currentResource = this.resourcesMap[this.currentResourceName]
        this.currentCardsList = this.currentResource.cardsList
        this.updateConfigurationObjectField('currentResource', this.currentResource)
        this.updateConfigurationObjectField('this.currentResourceName', this.currentResourceName)
    }
    drop(event: CdkDragDrop<string[]>){
        if (event.previousContainer === event.container) {
            moveItemInArray(this.currentCardsList, event.previousIndex, event.currentIndex);
           } 
    }
    onDragStart(event: CdkDragStart) {
        this.cardsService.changeCursorOnDragStart();
    }
    onDragEnd(event: CdkDragEnd) {
        this.cardsService.changeCursorOnDragEnd();
    }
    addNewCard(){
        this.currentResource?.addNewCard()
    }
    public onHostObjectChange(event) {
        if(event && event.action){
            if(event.action === 'set-configuration'){
                this._configuration = event.configuration;
                this.updateHostObject();
            }
        }
    }
    onCardEditClick(event){
        if(this.configuration?.cardsConfig?.editSlideIndex === event.id){ //close the editor
            this.configuration.cardsConfig.editSlideIndex = -1;
        }
        else{ 
            this.currentCardindex = this.configuration.cardsConfig.editSlideIndex = parseInt(event.id);
        }
    }
    onCardRemoveClick(event){
       this.currentResource?.removeCard(event.id)
       this.currentCardsList = this.currentResource?.cardsList
       this.updateConfigurationObjectField('currentCradsList', this.currentCardsList)
    }
    onSelectField($event){
        
    }
}
