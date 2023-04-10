import { List } from "../configuration";
import { ListData } from "./list-data.model";
import { ListLayout } from "./list-layout.model";
import { ListState } from "./list-state.model";

export interface ListContainer{
    Layout?: Partial<ListLayout>,
    Data?: ListData,
    State?: Partial<ListState>
    List?: List
}