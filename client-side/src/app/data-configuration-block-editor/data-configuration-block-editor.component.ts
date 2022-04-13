import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UDCService } from '../services/udc-service';
import { config } from '../addon.config';
import { SelectOption } from '../../../../shared/entities'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { DataConfigurationCard } from '../draggable-card-fields/cards.model';
import { CardsService } from '../draggable-card-fields/cards.service';

@Component({
    selector: 'data-configuration-block-editor',
    templateUrl: './data-configuration-block-editor.component.html',
    styleUrls: ['./data-configuration-block-editor.component.scss']
})

export class DataConfigurationBlockEditorComponent implements OnInit {
    @Input() hostObject: any;
    // currentResourceName: string
    currentResource: any;
    resourcesNames: SelectOption[] = []
    resources: any[] = [];
    currentEditMode: string
    editModeOptions : SelectOption[] = []
    cardsList : DataConfigurationCard[] = []
    currentResourceFields: string[] = ["CreationDateTime", "ModificationDateTime"];

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService, private udcService: UDCService, private cardsService: CardsService){
        this.udcService.pluginUUID = config.AddonUUID
    }

    ngOnInit(): void {
        this.editModeOptions = [{'key': 'readOnly', 'value': this.translate.instant('Read Only')}, {'key': 'modifiable', 'value': this.translate.instant('Modifiable')}]
        this.loadVariablesFromHostObject();
        this.initResources()
        .then(() =>{
            this.initCurrentResourceFields()
            this.initCardsList()
            debugger
        })
    
    }
    initCardsList(){
        if(this.cardsList.length > 0){
            return;
        }
        this.generateCardsListFromFields()
    }
    generateCardsListFromFields(){
        const fields = this.getResourceFields(this.currentResource);
        let counter = 0;
        this.currentResourceFields.map(field => {
            this.addNewCard(counter,field,false,false)
            counter++;
        })

    }
    addNewCard(id: number, key: string, readOnly: boolean, mandatory: boolean, showContent: boolean = false){
        const newCard = new DataConfigurationCard()
        newCard.id = id
        newCard.key = key
        newCard.label = key
        newCard.readOnly = readOnly
        newCard.mandatory = mandatory
        newCard.showContent = showContent
        this.cardsList.push(newCard)
    }
    async initCurrentResourceFields(){
        this.currentResourceFields = [...this.currentResourceFields, ...this.getResourceFields(this.currentResource),];
    }
    getResourceFields(resource: any){
        if(resource){
            return Object.keys(resource.Fields);
        }
        return [];
    }
    loadVariablesFromHostObject(){
        this.currentResource = this.hostObject?.currentResource;
        this.resourcesNames = this.hostObject.resorceNames || [];
        this.currentEditMode = this.hostObject.currentEditMode || this.editModeOptions[0].key;
    }
    async initResources(){
        const resources = await this.udcService.getCollections()
        this.resources = resources;
        this.resourcesNames = resources.map(resource => {
            return {'key': resource.Name, 'value': resource.Name}})
        if(this.resources.length > 0 && !this.currentResource){
            this.currentResource = this.resources[0]
        }
    }
    onResourceChanged($event){
        this.currentResource = this.resources.find((resource) => resource.Name == $event)
    }
    onEditModeChanged($event){
        this.currentEditMode = $event
    }
    drop(event: CdkDragDrop<string[]>){
        debugger
        if (event.previousContainer === event.container) {
            moveItemInArray(this.cardsList, event.previousIndex, event.currentIndex);
            debugger
           }
        // this.updateAllConfigurationObject() 
    }
    addNewCardClick(){
        const key = this.currentResourceFields.length > 0? this.currentResourceFields[0] : undefined
        this.addNewCard(this.cardsList.length,key, false,false, true);
    }
    onCardRemoveClick($event){
        this.cardsList = this.cardsList.filter((card) => card.id != $event.id)
    }
    onDragStart(event: CdkDragStart) {
        debugger
        this.cardsService.changeCursorOnDragStart();
    }
    onDragEnd(event: CdkDragEnd) {
        this.cardsService.changeCursorOnDragEnd();
    }

}