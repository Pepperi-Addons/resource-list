import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorsFormComponent } from '../editors-form/editors-form.component';
import { ViewsEditorComponent } from '../views-editor/views-editor.component';
import { SettingsComponent } from './settings.component';

@Component({
    selector: 'app-empty-route',
    template: '<div>Route is not exist.</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: 'editor/:key',
                component: EditorsFormComponent
            },
            {
                path: ':key',
                component: ViewsEditorComponent
            },
            { path: '**', component: EmptyRouteComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }



