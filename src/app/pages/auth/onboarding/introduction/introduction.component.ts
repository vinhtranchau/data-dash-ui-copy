import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

@Component({
  selector: 'dd-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {
  @Output() nextStage: EventEmitter<boolean> = new EventEmitter<boolean>();
  name: string;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.name = this.localStorageService.getUser().name || '';
  }

  continue() {
    this.nextStage.emit(true);
  }
}
