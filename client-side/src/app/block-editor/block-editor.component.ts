import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { ViewsCard } from '../draggable-card-fields/cards.model'
import { CardsService } from '../draggable-card-fields/cards.service'
import { config } from '../addon.config'
import { SelectOption, View } from 'shared';
import { ViewsService } from '../services/views.service';
import * as uuid from 'uuid';
import { GenericResourceService } from '../services/generic-resource-service';

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    resourcesNames: SelectOption[] = []
    resources: any[] = []
    resource: string
    views: View[] = []
    currentViews: SelectOption[] = []
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    viewsList: ViewsCard[]
    constructor(private genericResourceService: GenericResourceService,
                private cardsService: CardsService,
                private viewsService: ViewsService
               ) {
    }
    ngOnInit(): void {
        this.resource = this.hostObject.configuration.resource;
        this.viewsList = this.hostObject.configuration.viewsList || []
        Promise.all([this.setResourcesNames(), this.viewsService.getItems()])
        .then(([_, views]) => {
            if(!this.resource){
                this.resource = this.resourcesNames.length > 0? this.resourcesNames[0].value : undefined
            }
            this.updateConfigurationField('resource', this.resource)
            this.views = views
            this.setViewsByResource();
        })   
    }
    setViewsByResource(){
        this.currentViews = []
        this.views.forEach(view =>{
            if(view.Resource?.Name == this.resource){
                this.currentViews.push({
                    value: view.Name,
                    key: view.Key
                })
            }
        })
    }
    async setResourcesNames(){
        const resources = await this.genericResourceService.getResources()
        this.resourcesNames = resources.map(resource => {
            return {key: resource.Name, value: resource.Name}})
    }
    async onResourceChanged($event){
        this.restoreData()
        this.resource = $event
        this.setViewsByResource()
        this.updateConfigurationField('resource', this.resource)
        this.updateConfigurationField('viewsList', this.viewsList)
        
    }
    updateConfigurationField(key: string,value: any){
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: key,
            value: value
        })
    }
    restoreData(){
        this.viewsList = []
        this.resource = undefined
        this.currentViews = []
    }
    drop(event: CdkDragDrop<string[]>){
        if (event.previousContainer === event.container) {
            moveItemInArray(this.viewsList, event.previousIndex, event.currentIndex);
           }
        this.updateConfigurationField('viewsList', this.viewsList) 
    }
    onDragStart(event: CdkDragStart) {
        this.cardsService.changeCursorOnDragStart();
    }
    onDragEnd(event: CdkDragEnd) {
        this.cardsService.changeCursorOnDragEnd();
    }
    addNewCardClick(){
        const card: ViewsCard = {
            id: uuid.v4(),
            views: this.currentViews,
            showContent: true,
            title: "Grid",
            selectedView: this.currentViews.length > 0? this.currentViews[0] : undefined,
            mappedVariables: []
        }
        this.viewsList.push(card)
        this.updateConfigurationField('viewsList', this.viewsList)
    }
    onCardRemoveClick(event){
        this.viewsList = this.viewsList.filter((card) => card.id != event.id)
        this.updateConfigurationField('viewsList', this.viewsList)
    }

    
}
