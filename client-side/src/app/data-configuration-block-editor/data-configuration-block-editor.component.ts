import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { SelectOption } from '../../../../shared/entities'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { DataConfigurationCard } from '../draggable-card-fields/cards.model';
import { CardsService } from '../draggable-card-fields/cards.service';
import { TypeMap } from '../type-map';

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
    currentEditMode: string
    typeMap: TypeMap
    editModeOptions : SelectOption[] = []
    cardsList : DataConfigurationCard[] = []
    currentResourceFields: string[] = ["CreationDateTime", "ModificationDateTime"];

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService, private udcService: UDCService, private cardsService: CardsService){
        this.udcService.pluginUUID = config.AddonUUID
        this.typeMap = new TypeMap()
        this.typeMap.init()
    }

    ngOnInit(): void {
        this.editModeOptions = [{'key': 'readOnly', 'value': this.translate.instant('Read Only')}, {'key': 'modifiable', 'value': this.translate.instant('Modifiable')}]
        this.loadVariablesFromHostObject();
        this.initResources()
        .then(() =>{
            this.initCurrentResourceFields()
            this.initCardsList()
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
            this.addNewCard(index,field,false,false)
        })
    }
    addNewCard(id: number, key: string, readOnly: boolean, mandatory: boolean, showContent: boolean = false){
        const newCard = new DataConfigurationCard()
        newCard.id = id
        newCard.key = key
        newCard.label = key
        newCard.type = key == 'CreationDateTime' || key == 'ModificationDateTime' ? 'DateAndTime' :this.typeMap.get(this.currentResource.Fields[key].Type, this.currentResource.Fields[key].OptionalValues) 
        newCard.readOnly = readOnly
        newCard.mandatory = mandatory
        newCard.showContent = showContent
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
        this.currentResource = this.hostObject?.configuration?.currentResource;
        this.currentEditMode = this.hostObject?.configuration?.currentEditMode || this.editModeOptions[0].key;
        this.cardsList = this.hostObject?.configuration?.cardsList || []
    }
    async initResources(){
        this.resources= await this.udcService.getCollections()
        this.resourcesNames = this.resources.map(resource => {
            return {'key': resource.Name, 'value': resource.Name}})
        if(this.resources.length > 0 && !this.currentResource){
            this.currentResource = this.resources[0]
        }
    }
    onResourceChanged($event){
        this.restoreData()
        this.currentResource = this.resources.find((resource) => resource.Name == $event)
        this.initCurrentResourceFields()
        this.initCardsList()
        this.updateAllConfigurationObject()
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
        this.addNewCard(this.cardsList.length,key, false,false, true);
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
                currentResource: this.currentResource,
                currentEditMode: this.currentEditMode,
                cardsList: this.cardsList
            }
        })
    }
    restoreData(){
        this.cardsList = []
        this.currentResource = undefined
        this.currentEditMode = undefined;
        this.currentResourceFields =["CreationDateTime", "ModificationDateTime"];
        this.updateAllConfigurationObject()
    }
    onSaveCardsList(){
        this.updateAllConfigurationObject()
    }

}