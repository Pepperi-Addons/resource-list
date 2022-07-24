import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Routes, RouterModule } from '@angular/router';
import { PepIconModule } from '@pepperi-addons/ngx-lib/icon';
import { EditorsFormComponent } from '../editors-form/editors-form.component';
import { ViewsAndEditorsComponent } from '../views-and-editors';
import { ViewsFormComponent } from '../views-form/views-form.component';
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
                path: '',
                component: ViewsAndEditorsComponent
            },
            {
                path: 'editor/:key',
                component: EditorsFormComponent
            },
            {
                path: ':key',
                component: ViewsFormComponent
            },
            { path: '**', component: EmptyRouteComponent }
        ]
    }
];

@NgModule({
    imports: [
        MatIconModule,
        PepIconModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }



