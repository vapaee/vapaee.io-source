import { Component, HostListener } from '@angular/core';
import { AppService } from './services/common/app.service';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    styles: ['display: block;']
})
export class AppComponent {
  
    constructor(
        private app: AppService
    ) {
        this.app.init();
    }
    ngOnInit() {}
    
}
