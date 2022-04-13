import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UDCService } from '../services/udc-service'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { BlockEditorCard, IContent } from '../draggable-card-fields/cards.model'
import { CardsService } from '../draggable-card-fields/cards.service'
import { config } from '../addon.config'
import { TypeMap, HashMap } from '../type-map'
import { SelectOption } from '../../../../shared/entities';
import { DataViewFieldType } from '@pepperi-addons/papi-sdk';
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
    resourceFieldsMap: HashMap<any> = {}
    allowExport: boolean = false;
    allowImport: boolean = false;
    resourceFieldsKeys: string[] = []
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    typeMap: TypeMap 
    public cardsList: BlockEditorCard[] = []
    constructor(private translate: TranslateService,
                private udcService: UDCService,
                private cardsService: CardsService
               ) {
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
    addToResourceFieldsMap(fieldID: string, type: DataViewFieldType, title: string, mandatory: boolean){
        this.resourceFieldsMap[fieldID] = {'FieldID': fieldID, 'Type': type, 'Title': this.translate.instant(title), 'Mandatory': mandatory, 'ReadOnly': true}
    }
    genereateMapFromResourceFields(){
        this.addToResourceFieldsMap('CreationDateTime', 'DateAndTime', 'CreationDateTime', false)
        this.addToResourceFieldsMap('ModificationDateTime', 'DateAndTime', 'ModificationDateTime', false)
        for(let fieldKey of Object.keys(this.resource.Fields)){
            const mandatory = this.resource.Fields[fieldKey]?.Mandatory
            const optionalValues = this.resource.Fields[fieldKey]?.OptionalValues
            const type = this.typeMap.get(this.resource.Fields[fieldKey]?.Type, optionalValues)
            this.addToResourceFieldsMap(fieldKey, type, fieldKey, mandatory)
        }
        this.resourceFieldsKeys = Object.keys(this.resourceFieldsMap)
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
        if(this.cardsList && this.cardsList.length == 0){
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
            this.addNewCard(resourceFieldKey, this.resourceFieldsMap[resourceFieldKey])
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
        this.cardsList = []
        this.resource = undefined
        this.allowExport = false;
        this.allowImport = false
        this.title = ""
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
        $event.card.value = this.resourceFieldsMap[$event.card.name]
        this.updateAllConfigurationObject()
    }
    addNewCardClick(){
        debugger
        const name = this.resourceFieldsKeys.length > 0 ? this.resourceFieldsKeys[0] : undefined
        const value = name? this.resourceFieldsMap[name]: undefined
        this.addNewCard(name, value, true)
        this.updateAllConfigurationObject()
    }
    getResourceFieldsKeys(): string[]{
        return this.resourceFieldsMap ? Object.keys(this.resourceFieldsMap) : [];
        
    }
    addNewCard(name: string, value: any, showContent = false){
        let card = new BlockEditorCard();
        card.id = this.cardsList.length
        card.name = name
        card.value = value
        card.showContent = showContent
        card.width = 0 
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
