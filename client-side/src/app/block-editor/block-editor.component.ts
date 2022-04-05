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
    resourcesNames: KeyValuePair<any>[] = []
    resources: any[] = []
    resource: any
    names: KeyValuePair<any>[]
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
        this.loadVariablesFromHostObject()
        this.initResources()
        .then(() => {
            debugger
            this.initCurrentResource()
        })
        .then(() => {
            this.initCardsList()
            debugger
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
        this.resource = this.resources.length > 0 ? this.resources[0] : undefined
        this.fields =  this.resource? await this.blockEditorService.getItems(this.resource.Key): []
        this.currentResourceName = this.resource?.Name
        this.setFieldsKeysFromFields()
    }
    async initResources(){
        this.blockEditorService.pluginUUID = config.AddonUUID
        const resources = await this.blockEditorService.getCollections()
        this.resources = resources;
        this.names = resources.map(resource => {
            const resourceName = new KeyValuePair<any>()
            resourceName.Key = resource.Name
            resourceName.Value = resource
            return resourceName})
        debugger
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
        this.updateConfigurationObjectField('resource', undefined)
        this.resource = $event
        const fields = this.getFieldsByResourceName(this.resource.Key)
        this.fields = fields? Object.keys(fields) : []
        this.updateConfigurationObjectField('resource', this.resource)
        this.updateConfigurationObjectField('fields', this.fields)
    }
    getFieldsByResourceName(resourceName: string){
        return this.resources.find(resource => resourceName == resource.Key).Fields
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
