import { ICardEditor } from "../draggable-card-fields/cards.model"

export interface Resource {
    resource: any
    resourceName: string
    fields: any[]   
    cardsList: ICardEditor[]
    isInitillized: boolean
    newField: number
    init():Promise<void>
    addNewCard(): void
    removeCard(cardID: number): void
    getFieldsKeys(): string[]
}