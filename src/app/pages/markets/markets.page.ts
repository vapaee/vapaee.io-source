import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';

@Component({
    selector: 'markets-page',
    templateUrl: './markets.page.html',
    styleUrls: ['./markets.page.scss', '../common.page.scss']
})
export class MarketsPage implements OnInit, OnDestroy {

    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {
        
    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}
