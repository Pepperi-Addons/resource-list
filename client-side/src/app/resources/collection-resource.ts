import { BlockEditorService } from '../block-editor/block-editor.service'
import { ICardEditor } from '../draggable-card-fields/cards.model'
import { Resource } from './resource'

export class CollectionResource implements Resource{
    resource: any
    resourceName: string
    fields: any[] = []     
    cardsList: ICardEditor[] = []
    isInitillized: boolean = false
    newField: number
    constructor(resource: any, private blockEditorService: BlockEditorService){
        this.resource = resource;
        this.resourceName = resource?.Name
    }
    getFieldsKeys(): string[]{
        return this.fields.map((field) => field.Key)
    }
    async init():Promise<void>{
        await this.initFields()
        this.generateCardsListFromFields()
        this.isInitillized = true
    }
    async initFields():Promise<void>{
        this.fields = await this.blockEditorService.getItems(this.resourceName)
    }
    generateCardsListFromFields(){
        this.cardsList = []
        if(this.fields == undefined){
            return
        }
        this.fields.map(field => {
            this.addNewCard()
        })
        //need to update configuration
    }
    addNewCard(){
        let card = new ICardEditor();
        card.id = (this.cardsList.length);
        card.value = this.fields.length > 0 ? this.fields[card.id % this.fields.length] : undefined
        this.cardsList.push(card); 
        //need to update configuration
    }
    setCardsList(cardsList: ICardEditor[]){
        this.cardsList = cardsList
        //need to update configuration
    }

    removeCard(cardID: number){
        this.cardsList = this.cardsList.filter((card) => cardID != card.id)
    }
}