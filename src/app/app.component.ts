import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService } from './components/vpe-components.service';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    styles: ['display: block;']
})
export class AppComponent {

    // @HostBinding('class.hola') deviceClass: boolean = true;
    @HostBinding('class') class = 'box';
  
    constructor(
        private app: AppService,
        private components: VpeComponentsService
    ) {
        this.app.init();
    }
    
    ngOnInit() {
        this.app.onWindowResize.subscribe(d => {
            this.components.windowHasResized(d);
        });
        this.onWindowsResize();
    }


    @HostListener('window:resize')
    onWindowsResize() {
        this.app.onWindowsResize();
        this.class = this.app.device.class;
    }
    
}
