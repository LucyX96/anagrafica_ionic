import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]',
  standalone: true,
})
export class LongPressDirective {
  @Input() longPressDuration = 500; // ms
  @Output() longPress = new EventEmitter<Event>();
  @Output() shortPress = new EventEmitter<Event>();

  private pressTimer: any;
  private longPressTriggered = false;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPressStart(event: Event) {
    event.preventDefault();
    console.log('➡️ onPressStart', event);

    this.longPressTriggered = false;
    this.pressTimer = setTimeout(() => {
      this.longPressTriggered = true;
      console.log('🎯 longPress triggered', event);
      this.longPress.emit(event); // passa sempre l’evento
    }, this.longPressDuration);
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  @HostListener('touchend', ['$event'])
  onPressEnd(event: Event) {
    clearTimeout(this.pressTimer);
    console.log('⬅️ onPressEnd', event);

    if (!this.longPressTriggered) {
      console.log('⚡ shortPress triggered', event);
      this.shortPress.emit(event);
    } else {
      console.log('✔ longPress already triggered, skipping shortPress');
    }
  }
}

