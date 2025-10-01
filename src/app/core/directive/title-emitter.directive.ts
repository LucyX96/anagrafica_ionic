import { Directive, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive()
export abstract class TitleEmitterDirective implements OnInit, OnDestroy {
  @Output() titleChange = new EventEmitter<string | null>();

  abstract title: string;

  ngOnInit(): void {
    this.titleChange.emit(this.title);
  }

  ngOnDestroy(): void {
    this.titleChange.emit(null);
  }
}
