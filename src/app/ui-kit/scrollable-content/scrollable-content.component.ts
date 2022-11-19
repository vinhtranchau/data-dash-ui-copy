import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { SlideComponent } from './slide/slide.component';

@Component({
  selector: 'dd-scrollable-content',
  templateUrl: './scrollable-content.component.html',
  styleUrls: ['./scrollable-content.component.scss'],
})
export class ScrollableContentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ContentChildren(SlideComponent) children: QueryList<SlideComponent>;

  navigations: { id: string; title: string; active?: boolean }[] = [];

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(@Inject(DOCUMENT) private document: Document, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.scrollToTop();
    this.navigations = this.children.map((item) => ({ id: item.id, title: item.title }));
    this.cdr.detectChanges();
    this.children.forEach((item) =>
      item.visibleElement
        .asObservable()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((id) => {
          this.activeNavigator(id);
        })
    );
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  scrollTo(elementId: string) {
    this.document.getElementById(elementId)!.scrollIntoView({
      behavior: 'smooth',
    });
  }

  scrollToTop() {
    const firstId = this.children.get(0)?.id;
    if (firstId) {
      this.scrollTo(firstId);
    }
  }

  activeNavigator(id: string) {
    const nav = this.navigations.find((n) => n.id === id);
    this.navigations.forEach((n) => (n.active = false));
    if (nav) {
      nav.active = true;
    }
  }
}
