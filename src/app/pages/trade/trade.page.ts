import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ScatterService } from 'src/app/services/scatter.service';
import { BGBoxService } from 'src/app/services/bgbox.service';
import { CntService } from 'src/app/services/cnt.service';
import { ActivatedRoute } from '@angular/router';
import { Token } from 'src/app/services/utils.service';
import { VapaeeService, Asset, OrderRow, TokenOrders } from 'src/app/services/vapaee.service';
import { Subscriber } from 'rxjs';
import { VpePanelOrderEditorComponent } from 'src/app/components/vpe-panel-order-editor/vpe-panel-order-editor.component';
import { Feedback } from 'src/app/services/feedback.service';


@Component({
    selector: 'trade-page',
    templateUrl: './trade.page.html',
    styleUrls: ['./trade.page.scss', '../common.page.scss']
})
export class TradePage implements OnInit, OnDestroy {

    scope:string;
    comodity:Token;
    currency:Token;
    _orders:TokenOrders;
    timer:number;
    _chartData:any[];
    private onStateSubscriber: Subscriber<string>;
    private onBlocklistSubscriber: Subscriber<any[][]>;

    public loading: boolean;
    public error: string;

    @ViewChild(VpePanelOrderEditorComponent) orderform: VpePanelOrderEditorComponent;
   
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: ScatterService,
        public bgbox: BGBoxService,
        public cnt: CntService,
        public vapaee: VapaeeService,
        public route: ActivatedRoute

    ) {
        this.loading = false;
        this.error = "";
        this._orders = {sell:[],buy:[]};
        this.onStateSubscriber = new Subscriber<string>(this.onStateChange.bind(this));
        this.onBlocklistSubscriber = new Subscriber<any[][]>(this.onBlocklistChange.bind(this));
    }
    
    async updateAll(updateUser:boolean) {
        this.scope = this.route.snapshot.paramMap.get('scope');
        var com:string = this.scope.split(".")[0];
        var cur:string = this.scope.split(".")[1];
        this.comodity = await this.vapaee.getToken(com);
        this.currency = await this.vapaee.getToken(cur);
        this.vapaee.updateTrade(this.comodity, this.currency, updateUser);
    }

    async init() {
        // console.log("TradePage.init() <-- ");
        this.orderform ? this.orderform.reset() : null;
        this.comodity = null;
        this.currency = null;
        this._chartData = [];
        
        setTimeout(_ => { this.updateAll(true); }, 0);
        this.timer = window.setInterval(_ => { this.updateAll(false); }, 15000);
    }

    async destroy() {
        // console.log("TradePage.destroy() <-- ");
        clearInterval(this.timer);
    }

    get deposits(): Asset[] {
        return this.vapaee.deposits;
    }

    get balances(): Asset[] {
        return this.vapaee.balances;
    }

    get history() {
        var scope = this.vapaee.scopes[this.scope];
        return scope ? scope.history : [];
    }

    get orders() {
        var scope = this.vapaee.scopes[this.scope];
        return scope ? scope.orders : this._orders;
    }

    get headers() {
        var scope = this.vapaee.scopes[this.scope];
        var header = { 
            sell: {total:null, orders:0}, 
            buy: {total:null, orders:0}
        }
        return scope ? (scope.header ? scope.header : header) : header;
    }

    get summary() {
        var scope = this.vapaee.scopes[this.scope];
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.vapaee.zero_telos.clone(),
            records: [],
            volume: this.vapaee.zero_telos.clone()
        }, scope ? scope.summary : {});
        return _summary;
        // return scope ? (scope.summary ? scope.summary : _summary) : _summary;
    }


    private regenerateChartData() {
        if (this.vapaee.scopes[this.scope]) {
            // console.log("-----------------------------------------");
            // console.log(this.scope, this.vapaee.scopes[this.scope].blocklist);
            // console.log("-----------------------------------------");
            this._chartData = this.vapaee.scopes[this.scope].blocklist;
            // console.log("this._chartData", this._chartData);
        } else {
            // console.error("No existe todavía el scope ", this.scope);
        }
    }

    get chartData() {
        if (!this._chartData) this.regenerateChartData();
        return this._chartData;
    }

    get scopes() {
        return this.vapaee.scopes;
    }

    get tokens() {
        return this.vapaee.tokens;
    }

    ngOnDestroy() {
        this.onStateSubscriber.unsubscribe();
        this.onBlocklistSubscriber.unsubscribe();
        this.destroy();
    }

    ngOnInit() {
        this.init();
        this.app.onStateChange.subscribe(this.onStateSubscriber);
        this.vapaee.onBlocklistChange.subscribe(this.onBlocklistSubscriber);
    }

    onClickRow(e:{type:string, row:OrderRow}) {
        // console.log("**************** onClickRow", e);
        this.orderform.setPrice(e.row.price.clone());
        this.orderform.setAmount(e.row.sum.clone());
        this.orderform.wantsTo(e.type == "sell" ? "buy" : "sell");
    }

    onClickPrice(e) {
        // console.log("**************** onClickPrice", e);
        this.orderform.setPrice(e.row.price.clone());
    }
    
    onStateChange(state:string) {
        // console.log("TradePage.onStateChange("+state+")");
        if (state == "trade") {
            this.destroy();
            this.init();
        }
    } 
    
    onBlocklistChange(blocks:any[][]) {
        // console.log("TradePage.onBlocklistChange()",blocks);
        this.regenerateChartData();
    }

    // wallet actions 

    onWalletConfirmDeposit(amount: Asset) {
        console.log("------------------>", amount.toString());
        this.loading = true;
        this.error = null;
        this.vapaee.deposit(amount).then(_ => {
            console.log("------------------>", amount.toString());
            this.loading = false;
        }).catch(e => {
            console.error(typeof e, e);
            // this.error = "ERROR: " + JSON.stringify(typeof e == "string" ? JSON.parse(e) : e, null, 4);
            if (typeof e == "string") {
                this.error = "ERROR: " + JSON.stringify(JSON.parse(e), null, 4);
            } else {
                this.error = null;
            }
            this.loading = false;
        });
    }

    onWalletConfirmWithdraw(amount: Asset) {
        console.log("------------------>", amount.toString());
        this.loading = true;
        this.error = null;
        this.vapaee.withdraw(amount).then(_ => {
            console.log("------------------>", amount.toString());
            this.loading = false;
        }).catch(e => {
            console.error(typeof e, e);
            // this.error = "ERROR: " + JSON.stringify(typeof e == "string" ? JSON.parse(e) : e, null, 4);
            if (typeof e == "string") {
                this.error = "ERROR: " + JSON.stringify(JSON.parse(e), null, 4);
            } else {
                this.error = null;
            }
            this.loading = false;
        });        
    }

    gotoAccount() {
        this.app.navigate('/exchange/account/' + this.vapaee.current.name);
    }

    selectToken(scope: string) {
        this.app.navigate('/exchange/trade/' + scope);
    }
}
