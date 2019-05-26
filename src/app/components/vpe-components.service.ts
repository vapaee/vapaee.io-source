import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class VpeComponentsService {

    public onResize:Subject<any[][]> = new Subject();

    private setReady: Function;
    public waitReady: Promise<any> = new Promise((resolve) => {
        this.setReady = resolve;
    });
    constructor(
    ) {
        
    }

    public windowHasResized(e) {
        this.onResize.next(e);
    }


}

