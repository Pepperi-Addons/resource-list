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
    viewsDropDown: SelectOption[]
    resourcesDropDown: SelectOption[]
    @Input() hostObject: any;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    viewsList: ViewsCard[]
    loadCompleted: boolean = false
    constructor(private genericResourceService: GenericResourceService,
                private cardsService: CardsService,
                private viewsService: ViewsService
               ) {
    }
    ngOnInit(): void {
        this.resource = this.hostObject.configuration.resource;
        this.viewsList = this.hostObject.configuration.viewsList || []
        Promise.all([this.genericResourceService.getResources(), this.viewsService.getItems()])
        .then(([resources, views]) => {
            this.resources = resources
            this.views = views
            this.viewsList = this.filterViewsAndResourceThatNoLongerExist()
            this.loadCompleted = true
        })   
    }

    filterViewsAndResourceThatNoLongerExist(){
        const resourcesSet = new Set(this.resources.map(resource => resource.Name))
        const viewsSet = new Set(this.views.map(view => view.Key))
        return this.viewsList.filter(card => resourcesSet.has(card.selectedResource) && viewsSet.has(card.selectedView?.key) )
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

    async getResourcesNamesDropDown(){
        const resources = await this.genericResourceService.getResources()
       return  resources.map(resource => {
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
            views: [],
            showContent: true,
            title: "Grid",
            selectedView:  undefined,
        }
        
        this.viewsList.push(card)
        this.updateConfigurationField('viewsList', this.viewsList)
    }

    onCardRemoveClick(event){
        this.viewsList = this.viewsList.filter((card) => card.id != event.id)
        this.updateConfigurationField('viewsList', this.viewsList)
    }

    
}
