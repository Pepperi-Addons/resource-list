import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorsFormComponent } from './editors-form/editors-form.component';
import { ViewsAndEditorsComponent } from './views-and-editors/views-and-editors.component';
import { ViewsEditorComponent } from './views-editor/views-editor.component';

// Important for single spa
@Component({
    selector: 'app-empty-route',
    template: '<div></div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    {
        path: `settings/:addon_uuid`,
        children: [
            {
                path: 'views_and_editors',
                component: ViewsAndEditorsComponent,
                // TODO: solve routing
                // path: '**',
                // loadChildren: () => import('./addon/addon.module').then(m => m.AddonModule)
            },
            {
                path: 'views_and_editors/editor/:key',
                component: EditorsFormComponent
            },
            {
                path: 'views_and_editors/:key',
                component: ViewsEditorComponent
            },

        ]
    },
    {
        path: '**',
        component: EmptyRouteComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }