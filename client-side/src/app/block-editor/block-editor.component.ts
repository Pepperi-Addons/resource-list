import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockEditorService } from './block-editor.service'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ICardEditor, IContent, IContentEditor } from '../draggable-card-fields/cards.model'
import { CardsService } from '../draggable-card-fields/cards.service'
import { KeyValuePair, Test } from '@pepperi-addons/ngx-lib';
import { config } from '../addon.config'
@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    resourcesNames: {'key': string, 'value': string}[] = []
    resources: any[] = []
    resource: any
    currentResourceName: string
    title: string
    fieldsKeys: string[]
    fields: any[]
    allowExport: boolean = false;
    allowImport: boolean = false;
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    currentCardindex: number;
    private _configuration: IContent;
    public cardsList: ICardEditor[] = []
    get configuration(): IContent {
        return this._configuration;
    }
    constructor(private translate: TranslateService,
                private blockEditorService: BlockEditorService,
                private cardsService: CardsService
               ) {
    }
    ngOnInit(): void {
        this.restoreData()
        this.loadVariablesFromHostObject()
        this.initResources()
        .then(() => {
            return this.initCurrentResource()
        })
        .then(() => {
            this.initCardsList()
        })

    }
    async initCurrentResource(){
        if(!this.resource){
            this.resource = this.resources?.length > 0? this.resources[0] : undefined
            this.updateAllConfigurationObject()
        }
        this.currentResourceName = this.resource?.Name
        await this.setCurrentResourceFields()
        this.setFieldsKeysFromFields()
    }
    validateCardsListCompatibleToFieldsAndUpdate(){
        if(!this.fieldsKeys || !this.cardsList){
            return
        }
        const fieldsKeysSet: Set<string> = new Set(this.fieldsKeys)
        const cardsToDelete = this.getCardsToDelete(fieldsKeysSet)
        this.deleteCards(cardsToDelete)
        this.updateAllConfigurationObject()
    }
    deleteCards(cradToDelete: ICardEditor[]){
        cradToDelete.forEach((card) => {
            this.removeCard(card.id)
        })
    }
    getCardsToDelete(set: Set<string>): ICardEditor[]{
        if(!this.cardsList){
            return []
        }
        return this.cardsList.filter((card) => !(set.has(card.value)))
    }
    setFieldsKeysFromFields(){
        if(this.fields){
            this.fieldsKeys = this.fields.map((field) => field.Key)
        }
    }
    async setCurrentResourceFields(){
        this.fields =  this.resource? await this.blockEditorService.getItems(this.resource.Name): []
        this.setFieldsKeysFromFields()
    }
    async initResources(){
        this.blockEditorService.pluginUUID = config.AddonUUID
        const resources = await this.blockEditorService.getCollections()
        this.resources = resources;
        this.resourcesNames = resources.map(resource => {
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
        debugger
        this.cardsList = this.hostObject?.configuration?.cardsList
        if(this.cardsList && this.cardsList.length == 0){
            this.generateCardsListFromFields()
        }
        else{
            this.validateCardsListCompatibleToFieldsAndUpdate()
        }
    }
    generateCardsListFromFields(){
        this.cardsList = []
        if(this.fieldsKeys){
            this.fieldsKeys?.map((fieldKey) => {
                this.addNewCard().value = fieldKey
            })
        }
    }
    onAllowExportChange($event){
        this.allowExport = $event
        // this.updateConfigurationObjectField('allowExport', this.allowExport)
        this.updateAllConfigurationObject()
    }
    onAllowImportChange($event){
        this.allowImport = $event
        // this.updateConfigurationObjectField('allowImport', this.allowImport)
        this.updateAllConfigurationObject()
    }
    onTitleChanged($event):void{
        this.title = $event;
        // this.updateConfigurationObjectField('title', this.title)
        this.updateAllConfigurationObject()
    }
    async onResourceChanged($event){
        this.restoreData()
        this.currentResourceName = $event
        this.resource = this.getResourceByName(this.currentResourceName)
        await this.initCurrentResource()
        debugger
        this.generateCardsListFromFields()
        this.updateAllConfigurationObject()  
    }
    restoreData(){
        this.cardsList = []
        this.fields = []
        this.fieldsKeys = []
        this.resource = undefined
        this.currentResourceName = undefined
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
                cardsList: this.cardsList
            }
        })
    }
    getFieldsByResourceName(resourceName: string){
        return this.resources.find(resource => resourceName == resource.Key).Fields
    }
    getResourceByName(resourceName: string){
        return this.resources?.find((resource) => resource.Name == resourceName)
    }
    updateConfigurationObjectField(key: string, value: any) {
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: key, 
            value: value
        });
    }
    drop(event: CdkDragDrop<string[]>){
        if (event.previousContainer === event.container) {
            moveItemInArray(this.cardsList, event.previousIndex, event.currentIndex);
           } 
    }
    onDragStart(event: CdkDragStart) {
        this.cardsService.changeCursorOnDragStart();
    }
    onDragEnd(event: CdkDragEnd) {
        this.cardsService.changeCursorOnDragEnd();
    }
    addNewCardClick(){
        const card = this.addNewCard()
        card.value = this.fieldsKeys.length > 0 ? this.fieldsKeys[card.id % this.fieldsKeys.length] : undefined
        this.updateAllConfigurationObject()
    }
    addNewCard(){
        let card = new ICardEditor();
        card.id = (this.cardsList.length);
        this.cardsList.push(card);
        return card
    }
    onCardEditClick(event){
        if(this.configuration?.cardsConfig?.editSlideIndex === event.id){ //close the editor
            this.configuration.cardsConfig.editSlideIndex = -1;
        }
        // else{ 
        //     this.currentCardindex = this.configuration.cardsConfig.editSlideIndex = parseInt(event.id);
        // }
    }
    onCardRemoveClick(event){
       this.removeCard(event.id)
       this.updateAllConfigurationObject()
    }
    removeCard(id){
        this.cardsList = this.cardsList.filter((card) => card.id != id)
    }
}
