import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'contained-resource-array-field',
  templateUrl: './contained-resource-array-field.component.html',
  styleUrls: ['./contained-resource-array-field.component.scss']
})
export class ContainedResourceArrayFieldComponent implements OnInit {
  //inputs
  @Input() configurationObject: any
  @Input() editorDataSource: any
  @Input() referenceFields

  title: string = ""
  constructor() { }

  ngOnInit(): void {
    const [configuration, dataSource, referenceFields] = [this.configurationObject, this.editorDataSource, this.referenceFields]
    debugger
  }
  deepCopyInputs(){}

}
