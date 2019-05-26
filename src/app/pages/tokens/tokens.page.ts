import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ScatterService } from 'src/app/services/scatter.service';
import { BGBoxService } from 'src/app/services/bgbox.service';
import { CntService } from 'src/app/services/cnt.service';
import { VapaeeService, TableMap } from 'src/app/services/vapaee.service';
import { Token } from 'src/app/services/utils.service';
import { Subscriber } from 'rxjs';


@Component({
    selector: 'tokens-page',
    templateUrl: './tokens.page.html',
    styleUrls: ['./tokens.page.scss', '../common.page.scss']
})
export class TokensPage implements OnInit, OnDestroy {

    
    
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: ScatterService,
        public bgbox: BGBoxService,
        public cnt: CntService,
        public vapaee: VapaeeService
    ) {
        
    }

    get tokens(): Token[] {
        return this.vapaee.tokens;
    }

    get scopes(): TableMap {
        return this.vapaee.scopes;
    }
    /*
    summary(_scope) {
        console.error("DEPRECATED");
        var scope = this.scopes[_scope];
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.vapaee.zero_telos.clone(),
            records: [],
            volume: this.vapaee.zero_telos.clone()
        }, scope ? scope.summary : {});
        return _summary;
    }
    */

    ngOnDestroy() {
    }

    ngOnInit() {


    }
}
