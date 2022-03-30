import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockEditorService } from './block-editor.service'
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ICardEditor, IContent, IContentEditor } from '../draggable-card-fields/cards.model'
import { CardsService } from '../draggable-card-fields/cards.service'

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    resourcesNames:  {key:string, value:string}[] = []
    resources: any[] = []
    resource: any
    title: string
    allowExport: boolean = false;
    allowImport: boolean = false;
    items: any[] = []
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
        this.blockEditorService.pluginUUID = "0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3"
        this.resource = this.hostObject?.configuration?.resource
        this.title = this.hostObject.configuration.title
        this.allowExport = this.hostObject.configuration.allowExport
        this.items = this.hostObject.items
        this.blockEditorService.getCollections().then(resources => {
            this.resources = resources;
            this.resourcesNames = resources.map(resource => {
                return {key: resource.Name, value: resource.Name}})
        })
    }
    private updateHostObjectField(fieldKey: string, value: any) {
        
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey, 
            value: value
        });
    }
    private updateHostObject() {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }
    onAllowExportChange($event){
        this.allowExport = $event
        this.updateConfigurationObject()
    }
    onAllowImportChange($event){
        this.allowImport = $event
        this.updateConfigurationObject()
    }
    onTitleChanged($event):void{
        this.title = $event;
        this.updateConfigurationObject()
    }
    onResourceChanged($event):void{
        this.resource = $event
        this.blockEditorService.getItems(this.resource).then(items => {
            this.items = items
          })
        this.updateConfigurationObject()
    }
    updateConfigurationObject(){
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: {
                resource: this.resource,
                title: this.title,
                allowExport: this.allowExport,
                allowImport: this.allowImport,
                items: this.items
            }
        })
    }
    drop(event: CdkDragDrop<string[]>){
        if (event.previousContainer === event.container) {
            moveItemInArray(this.cardsList, event.previousIndex, event.currentIndex);
            // for(let index = 0 ; index < this.cardsList.length; index++){
            // //   this.cardsList[index].id = index;
            // }
            //  this.updateHostObject();
           } 
    }
    onDragStart(event: CdkDragStart) {
        this.cardsService.changeCursorOnDragStart();
    }
    onDragEnd(event: CdkDragEnd) {
        this.cardsService.changeCursorOnDragEnd();
    }
    addNewCardClick(){
        let card = new ICardEditor();
        card.id = (this.cardsList.length);
        this.cardsList.push(card); 
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
        this.updateHostObjectField(`galleryConfig.editSlideIndex`, this.configuration.cardsConfig.editSlideIndex);
    }
    onCardRemoveClick(event){
        this.configuration?.cards.splice(event.id, 1);
        this.configuration?.cards.forEach(function(card, index, arr) {card.id = index; });
    }
}
