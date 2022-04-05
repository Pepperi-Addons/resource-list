import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockEditorService } from './block-editor.service'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ICardEditor, IContent, IContentEditor } from '../draggable-card-fields/cards.model'
import { CardsService } from '../draggable-card-fields/cards.service'
import { KeyValuePair } from '@pepperi-addons/ngx-lib';
@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    resourcesNames: KeyValuePair<string>[] = []
    resources: any[] = []
    resource: any
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
        this.loadVariablesFromHostObject()
        this.initResources()
        .then(() => {
            this.initCurrentResource()
        })
        .then(() => {
            this.initCardsList()
        })
    }
    async initCurrentResource(){
        if(!this.resource){
            await this.setCurrentResourceAndFields()
            this.setFieldsKeysFromFields()
        }
    }
    validateCardsListCompatibleToFieldsAndUpdate(){
        if(!this.fieldsKeys){
            return
        }
        const fieldsKeysSet: Set<string> = new Set(this.fieldsKeys)
        const cardsToDelete = this.getCardsToDelete(fieldsKeysSet)
        this.deleteCards(cardsToDelete)
        this.updateConfigurationObjectField('cardsList', this.cardsList)
    }
    deleteCards(cradToDelete: ICardEditor[]){
        cradToDelete.forEach((card) => {
            this.removeCard(card.value)
        })
    }
    getCardsToDelete(set: Set<string>): ICardEditor[]{
        if(!this.cardsList){
            return []
        }
        return this.cardsList.filter((card) => !(card.value in set))
    }
    setFieldsKeysFromFields(){
        if(this.fields){
            this.fieldsKeys = this.fields.map((field) => field.Key)
        }
    }
    async setCurrentResourceAndFields(){
        this.resource = this.resources.length > 0? this.resources[0] : undefined
        this.fields =  this.resource? await this.blockEditorService.getItems(this.resource.Name): []
        this.setFieldsKeysFromFields()
    }
    async initResources(){
        this.blockEditorService.pluginUUID = "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
        const resources = await this.blockEditorService.getCollections()
        this.resources = resources;
        this.resourcesNames = resources.map(resource => {
            const resourceName = new KeyValuePair<string>()
            resourceName.Key = resource.Name
            resourceName.Value = resource.Name
            return resourceName})
    }
    loadVariablesFromHostObject(){
        this.resource = this.hostObject?.configuration?.resource
        this.title = this.hostObject?.configuration?.title
        this.allowExport = this.hostObject?.configuration?.allowExport
        this.allowImport = this.hostObject?.configuration?.allowImport
        this.cardsList = this.hostObject?.configuration?.cardsList
    }
    initCardsList(){
        this.cardsList = this.hostObject?.configuration?.cardsList
        if(!this.cardsList){
            this.generateCardsListFromFields()
        }
        else{
            this.validateCardsListCompatibleToFieldsAndUpdate()
        }
    }
    generateCardsListFromFields(){
        this.cardsList = []
        if(this.fieldsKeys){
            this.fields?.map((fieldKey) => {
                this.addNewCard().value = fieldKey
            })
        }
    }
    onAllowExportChange($event){
        this.allowExport = $event
        this.updateConfigurationObjectField('allowExport', this.allowExport)
    }
    onAllowImportChange($event){
        this.allowImport = $event
        this.updateConfigurationObjectField('allowImport', this.allowImport)
    }
    onTitleChanged($event):void{
        this.title = $event;
        this.updateConfigurationObjectField('title', this.title)
    }
    async onResourceChanged($event):Promise<void>{
        this.resource = $event
        const fields = this.getFieldsByResourceName(this.resource)
        this.fields = fields? Object.keys(fields) : []
        this.updateConfigurationObjectField('resource', this.resource)
        this.updateConfigurationObjectField('fields', this.fields)
    }
    getFieldsByResourceName(resourceName: string){
        return this.resources.find(resource => resourceName == resource.Name).Fields
    }
    updateConfigurationObjectField(key: string, value: any) {
        const hostObjectConfiguration = this.hostObject?.configuration
        if(hostObjectConfiguration){
            hostObjectConfiguration[key] = value
        }
    }
    drop(event: CdkDragDrop<string[]>){
        if (event.previousContainer === event.container) {
            moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
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
        else{ 
            this.currentCardindex = this.configuration.cardsConfig.editSlideIndex = parseInt(event.id);
        }
    }
    onCardRemoveClick(event){
       this.removeCard(event.field)
    }
    removeCard(value){
        this.cardsList = this.cardsList.filter((card) => card.value != value)
    }
}
