import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ScatterService } from 'src/app/services/scatter.service';
import { VapaeeService } from 'src/app/services/vapaee.service';

@Component({
    selector: 'markets-page',
    templateUrl: './markets.page.html',
    styleUrls: ['./markets.page.scss', '../common.page.scss']
})
export class MarketsPage implements OnInit, OnDestroy {

    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: ScatterService,
        public vapaee: VapaeeService
    ) {
        
    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}
