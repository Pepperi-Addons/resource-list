import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { SelectOption } from '../../../../shared/entities'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { DataConfigurationCard } from '../draggable-card-fields/cards.model';
import { CardsService } from '../draggable-card-fields/cards.service';
import { TypeMap } from '../type-map';
import { ResourceMap } from '../resource-map';

@Component({
    selector: 'data-configuration-block-editor',
    templateUrl: './data-configuration-block-editor.component.html',
    styleUrls: ['./data-configuration-block-editor.component.scss']
})

export class DataConfigurationBlockEditorComponent implements OnInit {
    @Input() hostObject: any;
    currentResource: any;
    resourcesNames: SelectOption[] = []
    resources: any[] = [];
    resourceMap: ResourceMap
    currentEditMode: string
    typeMap: TypeMap
    editModeOptions : SelectOption[] = []
    cardsList : DataConfigurationCard[] = []
    currentResourceFields: string[] = ["CreationDateTime", "ModificationDateTime"];
    currentResourceName: string;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService, private udcService: UDCService, private cardsService: CardsService){
        this.udcService.pluginUUID = config.AddonUUID
        this.typeMap = new TypeMap()
        this.typeMap.init()
        this.resourceMap = new ResourceMap()
    }
    ngOnInit(): void {
        this.editModeOptions = [{'key': 'readOnly', 'value': this.translate.instant('Read Only')}, {'key': 'modifiable', 'value': this.translate.instant('Modifiable')}]
        this.loadVariablesFromHostObject();
        this.initResources()
        .then(() =>{
            this.resourceMap.initMapFromResource(this.currentResource, this.translate)
            this.initCurrentResourceFields()
            this.initCardsList()
            this.setPageConfiguration()
            this.updateAllConfigurationObject()
        })
    }

    initCardsList(){
        if(this.cardsList.length > 0){
            return;
        }
        this.generateCardsListFromFields()
    }
    generateCardsListFromFields(){
        this.currentResourceFields.map((field, index) => {
            this.addNewCard(this.resourceMap.get(field), index,field,false,false)
        })
    }
    addNewCard(value, id: number, key: string, readOnly: boolean, mandatory: boolean, showContent: boolean = false){
        const newCard: DataConfigurationCard = {
            id : id,
            key : key,
            label : key,
            readOnly : readOnly,
            mandatory : mandatory,
            showContent : showContent,
            value: value,
            defaultValue: "" 
        }
        this.cardsList.push(newCard)
    }
    async initCurrentResourceFields(){
        this.currentResourceFields = [...this.currentResourceFields, ...this.getResourceFields(this.currentResource)];
    }
    getResourceFields(resource: any){
        if(resource){
            return Object.keys(resource.Fields);
        }
        return [];
    }
    loadVariablesFromHostObject(){
        this.currentResourceName = this.hostObject?.configuration?.currentResourceName;
        this.currentEditMode = this.hostObject?.configuration?.currentEditMode || this.editModeOptions[0].key;
        this.cardsList = this.hostObject?.configuration?.cardsList || []
    }
    async initResources(){
        this.resources= await this.udcService.getCollections();
        this.resourcesNames = []
        this.currentResource = undefined
        this.resources.forEach(resource => {
            if(resource.Name === this.currentResourceName){
                this.currentResource = resource;
            }
            this.resourcesNames.push({'key': resource.Name, 'value': resource.Name})
        })
        if(this.resources.length > 0 && !this.currentResource){
            this.currentResource = this.resources[0]
        }
        this.currentResourceName = this.currentResource?.Name
    }
    onResourceChanged($event){
        this.restoreData()
        this.currentResource = this.resources.find((resource) => resource.Name == $event)
        this.currentResourceName = this.currentResource.Name
        this.resourceMap.initMapFromResource(this.currentResource, this.translate)
        this.initCurrentResourceFields()
        this.initCardsList()
        this.updateAllConfigurationObject()
        this.setPageConfiguration()
    }
    onEditModeChanged($event){
        this.currentEditMode = $event
        this.updateAllConfigurationObject()
    }
    drop(event: CdkDragDrop<string[]>){
        if (event.previousContainer === event.container) {
            moveItemInArray(this.cardsList, event.previousIndex, event.currentIndex);
           }
        this.updateAllConfigurationObject() 
    }
    addNewCardClick(){
        const key = this.currentResourceFields.length > 0? this.currentResourceFields[0] : undefined
        this.addNewCard(this.resourceMap.get(key) ,this.cardsList.length,key, false,false, true);
        this.updateAllConfigurationObject()
    }
    onCardRemoveClick($event){
        this.cardsList = this.cardsList.filter((card) => card.id != $event.id)
        this.updateAllConfigurationObject()
    }
    onDragStart(event: CdkDragStart) {
        this.cardsService.changeCursorOnDragStart();
    }
    onDragEnd(event: CdkDragEnd) {
        this.cardsService.changeCursorOnDragEnd();
    }
    updateAllConfigurationObject(){
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: {
                currentEditMode: this.currentEditMode,
                cardsList: this.cardsList,
                currentResourceName: this.currentResource?.Name
            }
        })
    }
    restoreData(){
        this.cardsList = []
        this.currentResource = undefined
        this.currentEditMode = undefined;
        this.currentResourceName = undefined
        this.currentResourceFields =["CreationDateTime", "ModificationDateTime"];
        this.resourceMap = new ResourceMap()
        this.updateAllConfigurationObject()
    }
    onSaveCardsList(){
        this.updateAllConfigurationObject()
    }
    setPageConfiguration(){
        this.hostEvents.emit({
            action: 'set-page-configuration',
            
            pageConfiguration: {
                Parameters: [
                    {
                        Key: this.currentResourceName + '_key',
                        Type: "String",
                        Consume: true,
                    }
                ]
            }
        })
    }
    onSelectKey($event){
        this.cardsList[$event.id].key= $event.key
        this.cardsList[$event.id].label= $event.key
        this.cardsList[$event.id].value.FieldID= $event.key
        this.cardsList[$event.id].value.Title= $event.key
        this.updateAllConfigurationObject()
    }
    onReadOnlyChange($event){
        this.cardsList[$event.id].readOnly = $event.readOnly;
        this.cardsList[$event.id].value.ReadOnly = $event.readOnly
        this.updateAllConfigurationObject();
    }
}