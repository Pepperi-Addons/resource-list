import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericResourceService } from '../services/generic-resource-service';
import { SelectOption, View, ViewsCard } from 'shared';
import { debug } from 'console';


@Component({
  selector: 'draggable-card-fields',
  templateUrl: './draggable-card-fields.component.html',
  styleUrls: ['./draggable-card-fields.component.scss']
})

export class DraggableCardFieldsComponent {
    @Input() card: ViewsCard
    @Input() resources: any[]
    @Input() views: View[]
    resourcesDropDown: SelectOption[] = []
    viewsDropDown: SelectOption[] = []
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() updateCard: EventEmitter<ViewsCard> = new EventEmitter()

    constructor() {}

    ngOnInit(){
        this.resourcesDropDown = this.getResourcesNamesDropDown()
        if(this.card.selectedResource){
            this.viewsDropDown = this.getViewsDropDownByResource(this.card.selectedResource)
        }
    }

    removeResourceIfNotExist(){
        if(!this.card.selectedResource){
            this.card.selectedView = undefined
            return 
        }
        if(!this.resourcesDropDown.find(resource => resource.key == this.card.selectedResource)){
            this.card.selectedResource = undefined
            this.card.selectedView = undefined
        }
    }

    onResourceChanged(event){
        this.card.selectedResource = event
        this.viewsDropDown = this.getViewsDropDownByResource(event)
        if(this.viewsDropDown.length > 0){
            this.card.selectedView = this.viewsDropDown[0]
            this.card.title = this.viewsDropDown[0].value;
        }
        else{
            this.card.selectedView = undefined
        }
        this.updateCard.emit(this.card)
    }

    removeViewIfIsNotExist(){
        if(!this.card.selectedView){
            return 
        }
        if(!this.viewsDropDown.find(view => view.key == this.card.selectedView.key)){
            this.card.selectedView = undefined
        }
    }

    ngOnChanges(event){
    }

    onRemoveClick() {
    this.removeClick.emit({id: this.card.id})
    }

    onEditClick() {
        this.card.showContent = !this.card.showContent
        this.updateCard.emit(this.card)
    }

    onViewChanged(key){
        this.card.selectedView = this.viewsDropDown.find((view) => key === view.key) 
        this.card.title = this.card.selectedView.value;
        this.updateCard.emit(this.card)
    }

    onTitleChanged(title){
        this.card.title = title;
        this.updateCard.emit(this.card)
    }

    getResourcesNamesDropDown(){
       return this.resources.map(resource => {
            return {key: resource.Name, value: resource.Name}})
    }
    
    getViewsDropDownByResource(resourceName: string){
        return this.views.filter(view => view.Resource.Name == resourceName).map(view => {
            return {
                key: view.Key,
                value: view.Name
            }
        })
    }
}
