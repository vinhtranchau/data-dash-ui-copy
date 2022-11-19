import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { delay, filter, Subject } from 'rxjs';

@Directive({
  selector: '[dcObserveVisibility]',
})
export class ObserveVisibilityDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() debounceTime = 0;
  @Input() threshold = 0.75;

  @Output() visible = new EventEmitter<HTMLElement>();

  private observer: IntersectionObserver | undefined;
  private subject$ = new Subject<{
    entry: IntersectionObserverEntry | null;
    observer: IntersectionObserver | null;
  }>();

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.createObserver();
  }

  ngAfterViewInit() {
    this.startObservingElements();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    this.subject$.next({ entry: null, observer: null });
    this.subject$.complete();
  }

  private createObserver() {
    const options = {
      rootMargin: '0px',
      threshold: this.threshold,
    };

    const isIntersecting = (entry: IntersectionObserverEntry) => entry.isIntersecting || entry.intersectionRatio > 0;

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (isIntersecting(entry)) {
          this.subject$.next({ entry, observer });
        }
      });
    }, options);
  }

  private startObservingElements() {
    if (!this.observer) {
      return;
    }

    this.observer.observe(this.element.nativeElement);

    this.subject$.pipe(delay(this.debounceTime), filter(Boolean)).subscribe(async ({ entry, observer }) => {
      if (entry && observer) {
        const target = entry.target as HTMLElement;
        this.visible.emit(target);
      }
    });
  }
}
