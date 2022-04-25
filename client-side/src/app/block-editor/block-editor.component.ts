import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UDCService } from '../services/udc-service'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { BlockEditorCard, IContent } from '../draggable-card-fields/cards.model'
import { CardsService } from '../draggable-card-fields/cards.service'
import { config } from '../addon.config'
import { TypeMap, HashMap } from '../type-map'
import { SelectOption } from '../../../../shared/entities';
import { ResourceMap } from '../resource-map'
@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    resourcesNames: SelectOption[] = []
    resources: any[] = []
    resource: any
    title: string
    resourceMap: ResourceMap;
    allowExport: boolean = false;
    allowImport: boolean = false;
    resourceFieldsKeys: string[] = []
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    typeMap: TypeMap 
    cardsList: BlockEditorCard[]
    constructor(private translate: TranslateService,
                private udcService: UDCService,
                private cardsService: CardsService
               ) {
                   this.resourceMap = new ResourceMap();
    }
    ngOnInit(): void {
        this.typeMap = new TypeMap()
        this.typeMap.init()
        this.loadVariablesFromHostObject()
        this.initResources()
        .then(() => {
            this.initCurrentResource()
            this.initCardsList()
        })
    }
    initCurrentResource(){
        if(!this.resource){
            this.resource = this.resources?.length > 0? this.resources[0] : undefined
            this.updateAllConfigurationObject()
        }
        
        this.genereateMapFromResourceFields()
    }
    genereateMapFromResourceFields(){
        this.resourceMap.initMapFromResource(this.resource, this.translate)
        this.resourceFieldsKeys = this.resourceMap.getKeys()
    }
    validateCardsListCompatibleToFieldsAndUpdate(){
        if(!this.cardsList){
            return
        }
        const fieldsKeysSet: Set<string> = new Set(this.resourceFieldsKeys)
        const cardsToDelete = this.getCardsToDelete(fieldsKeysSet)
        this.deleteCards(cardsToDelete)
        this.updateAllConfigurationObject()
    }
    deleteCards(cradToDelete: BlockEditorCard[]){
        cradToDelete.forEach((card) => {
            this.removeCard(card.id)
        })
    }
    getCardsToDelete(set: Set<string>): BlockEditorCard[]{
        return this.cardsList? [] : this.cardsList.filter((card) => !(set.has(card.name)))
    }
    async initResources(){
        this.udcService.pluginUUID = config.AddonUUID
        this.resources = await this.udcService.getCollections()
        this.resourcesNames = this.resources.map(resource => {
            return {'key': resource.Name, 'value': resource.Name}})
    }
    loadVariablesFromHostObject(){
        this.resource = this.hostObject?.configuration?.resource
        this.title = this.hostObject?.configuration?.title
        this.allowExport = this.hostObject?.configuration?.allowExport
        this.allowImport = this.hostObject?.configuration?.allowImport
        this.cardsList = this.hostObject?.configuration?.cardsList
    }
    initCardsList(){
        if(!this.cardsList){
            this.generateCardsListFromFields()
        }
        else{
            this.validateCardsListCompatibleToFieldsAndUpdate()
        }
        this.updateAllConfigurationObject()
    }
    generateCardsListFromFields(){
        this.cardsList = []
        this.resourceFieldsKeys.map(resourceFieldKey => {
            this.addNewCard(resourceFieldKey, this.resourceMap.get(resourceFieldKey))
        })
    }
    onAllowExportChange($event){
        this.allowExport = $event
        this.updateAllConfigurationObject()
    }
    onAllowImportChange($event){
        this.allowImport = $event
        this.updateAllConfigurationObject()
    }
    onTitleChanged($event):void{
        this.title = $event;
        this.updateAllConfigurationObject()
    }
    async onResourceChanged($event){
        this.restoreData()
        this.resource = this.resources?.find((resource) => resource.Name == $event)
        await this.initCurrentResource()
        this.generateCardsListFromFields()
        this.updateAllConfigurationObject()  
    }
    restoreData(){
        this.cardsList = undefined
        this.resource = undefined
        this.allowExport = false;
        this.allowImport = false
        this.title = ""
        this.resourceMap = new ResourceMap()
        this.updateAllConfigurationObject()
    }
    updateAllConfigurationObject(){
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: {
                resource: this.resource,
                title: this.title,
                allowExport: this.allowExport,
                allowImport: this.allowImport,
                cardsList: this.cardsList,
                resourceName: this.resource?.Name
            }
        })
    }
    drop(event: CdkDragDrop<string[]>){
        if (event.previousContainer === event.container) {
            moveItemInArray(this.cardsList, event.previousIndex, event.currentIndex);
           }
        this.updateAllConfigurationObject() 
    }
    onDragStart(event: CdkDragStart) {
        this.cardsService.changeCursorOnDragStart();
    }
    onDragEnd(event: CdkDragEnd) {
        this.cardsService.changeCursorOnDragEnd();
    }
    onSelectField($event){
        $event.card.value = this.resourceMap.get($event.card.name)
        this.updateAllConfigurationObject()
    }
    addNewCardClick(){
        const name = this.resourceFieldsKeys.length > 0 ? this.resourceFieldsKeys[0] : undefined
        const value = name? this.resourceMap.get(name): undefined
        this.addNewCard(name, value, true)
        this.updateAllConfigurationObject()
    }
    getResourceFieldsKeys(): string[]{
        const keys = this.resourceMap.getKeys();
        return keys ? keys: [];
        
    }
    addNewCard(name: string, value: any, showContent = false){
        const card: BlockEditorCard = {
            id : this.cardsList.length,
            name : name,
            value : value,
            showContent : showContent,
            width : 10
        }
        this.cardsList.push(card);
        return card
    }
    onCardRemoveClick(event){
       this.removeCard(event.id)
       this.updateAllConfigurationObject()
    }
    removeCard(id){
        this.cardsList = this.cardsList.filter((card) => card.id != id)
        this.updateAllConfigurationObject()
    }
    onWidthChange(){
        this.updateAllConfigurationObject()
    }
}
