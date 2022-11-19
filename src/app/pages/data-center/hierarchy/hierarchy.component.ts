import { Component, OnInit } from '@angular/core';
import { HierarchyType } from '../../../core/models/hierarchy.model';

@Component({
  selector: 'dd-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss'],
})
export class HierarchyComponent implements OnInit {
  HierarchyType = HierarchyType;

  ngOnInit(): void {
  }
}
