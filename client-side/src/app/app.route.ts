import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorsFormComponent } from './editors-form/editors-form.component';
import { ViewsAndEditorsComponent } from './views-and-editors/views-and-editors.component';
import { ViewsFormComponent } from './views-form/views-form.component';
// Important for single spa
@Component({
    selector: 'app-empty-route',
    template: '<div>route does not exist</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
    },
    {
        path: '**',
        component: EmptyRouteComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }