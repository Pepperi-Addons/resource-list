import { ListData } from "./list-data.model";
import { ListLayout } from "./list-layout.model";
import { ListState } from "./list-state.model";

export interface ListContainer{
    Layout?: ListLayout,
    Data?: ListData,
    State?: ListState
}