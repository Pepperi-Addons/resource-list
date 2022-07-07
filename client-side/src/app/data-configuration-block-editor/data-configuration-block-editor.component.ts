import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { Editor, SelectOption } from '../../../../shared/entities'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { DataConfigurationCard } from '../draggable-card-fields/cards.model';
import { CardsService } from '../draggable-card-fields/cards.service';
import { TypeMap } from '../type-map';
import { ResourceMap } from '../resource-map';
import { DataViewService } from '../services/data-view-service';
import { EditorsService } from '../services/editors.service';

@Component({
    selector: 'data-configuration-block-editor',
    templateUrl: './data-configuration-block-editor.component.html',
    styleUrls: ['./data-configuration-block-editor.component.scss']
})

export class DataConfigurationBlockEditorComponent implements OnInit {
    @Input() hostObject: any;
    // currentResource: any;
    // resourcesNames: SelectOption[] = []
    // resources: any[] = [];
    // resourceMap: ResourceMap
    // currentEditMode: string
    // typeMap: TypeMap
    // editModeOptions : SelectOption[] = []
    // cardsList : DataConfigurationCard[] = []
    // currentResourceFields: string[] = ["CreationDateTime", "ModificationDateTime"];
    // currentResourceName: string;
    // relativeHeight: number;
    // minHeight: number;

    //new vars
    editors: Editor[] = []
    resources: any[] = []
    resourcesOptions : SelectOption[] = []
    currentResourceName: any
    editorsOptions: SelectOption[] = []
    currentEditorKey: string

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
        private udcService: UDCService, 
        private editorsService: EditorsService){
        this.udcService.pluginUUID = config.AddonUUID
    }
    ngOnInit(): void{
        this.init()
    }
    async init(){
        this.resources = await this.udcService.getCollections() || []
        this.editors = await this.editorsService.getItems() || []
        this.initPepSelectResource()
        this.initPepSelectEditors()
        this.updateHostObject()
    }
    initPepSelectResource(){
        this.setResourcesOptions()
        this.currentResourceName = this.hostObject?.configuration?.currentResourceName
        this.setCurrentResourceName()
    }
    initPepSelectEditors(){
        this.setEditorsOptions(this.currentResourceName)
        this.currentEditorKey = this.hostObject?.configuration?.currentEditorKey
        this.setCurrentEditor(this.editorsOptions)
    }
    updateHostObject(){
        this.updateConfigurationField('currentResourceName', this.currentResourceName)
        this.updateConfigurationField('currentEditorKey', this.currentEditorKey)
    }
    setResourcesOptions(){
        this.resourcesOptions = this.resources.map(collection => {
            return {
                key: collection.Name,
                value: collection.Name
            }
        })
    }
    setCurrentResourceName(){
        if(this.currentResourceName == undefined || !this.isResourceExist(this.resourcesOptions, this.currentResourceName)){
            this.currentResourceName = this.resourcesOptions.length > 0? this.resourcesOptions[0].value : undefined
        }
    }
    isResourceExist(resourcesOptions: SelectOption[],resourceName: string): Boolean{
        return resourcesOptions.find(resourceOption => resourceOption.value == resourceName) != undefined
    }
    setEditorsOptions(resourceName: string){
        const resourceEditors = this.editors.filter(editor => editor.Resource.Name == resourceName)
        this.editorsOptions = resourceEditors.map(resourceEditor => {
            return {
                key: resourceEditor.Key,
                value: resourceEditor.Name 
            }
        })
    }
    setCurrentEditor(editorsOptions: SelectOption[]){
        if(this.currentEditorKey == undefined|| !this.isEditorExistInOptions(editorsOptions) ){
            this.currentEditorKey = this.editorsOptions.length > 0 ? this.editorsOptions[0].key : undefined
        }
    }
    isEditorExistInOptions(editorOptions: SelectOption[]): boolean{
        return editorOptions.find((option) => {
            return this.currentEditorKey == option.key 
        }) != undefined 
    }
    async onResourceChanged($event){
        this.currentEditorKey = undefined
        this.currentResourceName = $event
        await this.setEditorsOptions(this.currentResourceName)
        this.setCurrentEditor(this.editorsOptions)
        this.updateHostObject()
    }
    onEditorChanged($event){
        this.currentEditorKey = $event
        this.updateHostObject()
    }
    updateConfigurationField(key: string,value: any){
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: key,
            value: value
        })
    }
    //-------------- old functions ---------------
    // ngOnInit(): void {
    //     this.editModeOptions = [{'key': 'readOnly', 'value': this.translate.instant('Read Only')}, {'key': 'modifiable', 'value': this.translate.instant('Modifiable')}]
    //     this.loadVariablesFromHostObject();
    //     this.initResources()
    //     .then(() =>{
    //         this.resourceMap.initMapFromResource(this.currentResource, this.translate)
    //         this.initCurrentResourceFields()
    //         this.initCardsList()
    //         this.setPageConfiguration()
    //         this.updateAllConfigurationObject()
    //     })

    // }
    // initCardsList(){
    //     if(this.cardsList.length > 0){
    //         return;
    //     }
    //     this.generateCardsListFromFields()
    // }
    // generateCardsListFromFields(){
    //     this.currentResourceFields.map((field, index) => {
    //         this.addNewCard(this.resourceMap.get(field), index,field,false,false)
    //     })
    // }
    // addNewCard(value, id: number, key: string, readOnly: boolean, mandatory: boolean, showContent: boolean = false){
    //     const newCard: DataConfigurationCard = {
    //         id : id,
    //         key : key,
    //         label : key,
    //         readOnly : readOnly,
    //         mandatory : mandatory,
    //         defaultValue: "",
    //         showContent: false
    //     }
    //     this.cardsList.push(newCard)
    // }
    // async initCurrentResourceFields(){
    //     this.currentResourceFields = [...this.currentResourceFields, ...this.getResourceFields(this.currentResource)];
    // }
    // getResourceFields(resource: any){
    //     if(resource){
    //         return Object.keys(resource.Fields);
    //     }
    //     return [];
    // }
    // loadVariablesFromHostObject(){
    //     this.currentResourceName = this.hostObject?.configuration?.currentResourceName;
    //     this.currentEditMode = this.hostObject?.configuration?.currentEditMode || this.editModeOptions[0].key;
    //     this.cardsList = this.hostObject?.configuration?.cardsList || []
    //     this.relativeHeight = this.hostObject?.configuration?.relativeHeight || 100
    //     this.minHeight = this.hostObject?.configuration?.minHeight || 20
    // }
    // async initResources(){
    //     this.resources= await this.udcService.getCollections();
    //     this.resourcesNames = []
    //     this.currentResource = undefined
    //     this.resources.forEach(resource => {
    //         if(resource.Name === this.currentResourceName){
    //             this.currentResource = resource;
    //         }
    //         this.resourcesNames.push({'key': resource.Name, 'value': resource.Name})
    //     })
    //     if(this.resources.length > 0 && !this.currentResource){
    //         this.currentResource = this.resources[0]
    //     }
    //     this.currentResourceName = this.currentResource?.Name
    // }
    // onResourceChanged($event){
    //     this.restoreData()
    //     this.currentResource = this.resources.find((resource) => resource.Name == $event)
    //     this.currentResourceName = this.currentResource.Name
    //     this.resourceMap.initMapFromResource(this.currentResource, this.translate)
    //     this.initCurrentResourceFields()
    //     this.initCardsList()
    //     this.updateAllConfigurationObject()
    //     this.setPageConfiguration()
    // }
    // drop(event: CdkDragDrop<string[]>){
    //     if (event.previousContainer === event.container) {
    //         moveItemInArray(this.cardsList, event.previousIndex, event.currentIndex);
    //        }
    //     this.updateAllConfigurationObject() 
    // }
    // addNewCardClick(){
    //     const key = this.currentResourceFields.length > 0? this.currentResourceFields[0] : undefined
    //     this.addNewCard(this.resourceMap.get(key) ,this.cardsList.length,key, false,false, true);
    //     this.updateAllConfigurationObject()
    // }
    // onCardRemoveClick($event){
    //     this.cardsList = this.cardsList.filter((card) => card.id != $event.id)
    //     this.updateAllConfigurationObject()
    // }
    // onDragStart(event: CdkDragStart) {
    //     this.cardsService.changeCursorOnDragStart();
    // }
    // onDragEnd(event: CdkDragEnd) {
    //     this.cardsService.changeCursorOnDragEnd();
    // }
    // updateAllConfigurationObject(){
    //     this.hostEvents.emit({
    //         action: 'set-configuration',
    //         configuration: {
    //             currentEditMode: this.currentEditMode,
    //             cardsList: this.cardsList,
    //             currentResourceName: this.currentResource?.Name,
    //             minHeight: this.minHeight,
    //             relativeHeight: this.relativeHeight
    //         }
    //     })
    // }
    // restoreData(){
    //     this.cardsList = []
    //     this.currentResource = undefined
    //     this.currentEditMode = undefined;
    //     this.currentResourceName = undefined
    //     this.currentResourceFields =["CreationDateTime", "ModificationDateTime"];
    //     this.resourceMap = new ResourceMap()
    //     this.minHeight = 20
    //     this.relativeHeight = 100;
    //     this.updateAllConfigurationObject()
    // }
    // onSaveCardsList(){
    //     this.updateAllConfigurationObject()
    // }
    // setPageConfiguration(){
    //     this.hostEvents.emit({
    //         action: 'set-page-configuration',
    //         pageConfiguration: {
    //             Parameters: [
    //                 {
    //                     Key: 'collection_' + this.currentResourceName,
    //                     Type: "String",
    //                     Consume: true,
    //                 }
    //             ]
    //         }
    //     })
    // }
}