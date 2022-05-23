import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { View } from "../../../../shared/entities"
import { ViewsService } from '../services/views.service';

@Component({
  selector: 'app-views-editor',
  templateUrl: './views-editor.component.html',
  styleUrls: ['./views-editor.component.scss']
})
export class ViewsEditorComponent implements OnInit {
  private key: string
  view: View
  name: string = "before"

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewsService: ViewsService
  ) { }

  ngOnInit(): void {
    this.key = this.route.snapshot.paramMap.get('key')
    this.viewsService.getViews(this.key).then(views => {
      this.view = views[0]
    })
  }
  onBackToList(){
    this.router.navigate([".."], { relativeTo: this.route})
  }

}
