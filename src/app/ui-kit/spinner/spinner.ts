import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

export class Spinner {
  message: string = '';
  message$: BehaviorSubject<string> = new BehaviorSubject<string>(this.message);

  isLoading: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoading);

  emit() {
    this.message$.next(this.message);
    this.isLoading$.next(this.isLoading);
  }
}

export class LoadingSpinnerElement extends Spinner {
  private notifier$: Subject<LoadingSpinnerElement>;

  constructor(message: string, isLoading: boolean, notifier$: Subject<LoadingSpinnerElement>) {
    super();

    this.message = message;
    this.isLoading = isLoading;

    this.emit();

    this.notifier$ = notifier$;
  }

  show() {
    this.isLoading = true;
    this.emit();
    this.notifier$.next(this);
  }

  hide() {
    this.isLoading = false;
    this.emit();
    this.notifier$.next(this);
  }
}

export class LoadingSpinner<T> extends Spinner {
  loaders: { [K in keyof T]: LoadingSpinnerElement };

  private child$: Subject<LoadingSpinnerElement> = new Subject<LoadingSpinnerElement>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(loaders: { [K in keyof T]: string }) {
    super();
    this.startLoading();
    // @ts-ignore
    this.loaders = {};
    Object.keys(loaders).forEach((key) => {
      // @ts-ignore
      this.loaders[key] = new LoadingSpinnerElement(loaders[key], true, this.child$);
    });

    this.child$
      .asObservable()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((element) => {
        if (element.isLoading) {
          this.isLoading = true;
        } else {
          const loaders = Object.keys(this.loaders);

          // Check all injected loaders and decide if global loading is finished
          this.isLoading = !Boolean(
            loaders
              // @ts-ignore
              .map((key) => this.loaders[key].isLoading)
              .filter((isLoading) => !isLoading).length === loaders.length
          );

          // NOTE: The very first behavior subject will be `isLoading = true` and finally this will be false when
          //  everything is finished.
        }
        this.emit();
      });
  }

  startLoading() {
    this.isLoading = true;
  }

  destroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
