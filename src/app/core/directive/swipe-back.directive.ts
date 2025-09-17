import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import Hammer from 'hammerjs';

@Directive({
  selector: '[swipeBack]'
})
export class SwipeBackDirective implements OnInit, OnDestroy {
  private hammer?: HammerManager;

  constructor(private el: ElementRef, private navCtrl: NavController) { }

  ngOnInit() {
    this.hammer = new Hammer(this.el.nativeElement);
    this.hammer = new Hammer(this.el.nativeElement, {
      touchAction: 'pan-y'
    });

    this.hammer.on('swiperight', () => {
      this.navCtrl.back();
    });

    this.hammer.on('pan', (ev) => {
      console.log('pan detected:', ev.deltaX, ev.deltaY, ev.direction);

      // verifica swipe verso destra
      if (ev.deltaX > 100 && Math.abs(ev.deltaY) < 50) {
        console.log('swipe-right trigger!');
        this.navCtrl.back();
      }
    });
  }

  ngOnDestroy() {
    this.hammer?.destroy();
  }
}
