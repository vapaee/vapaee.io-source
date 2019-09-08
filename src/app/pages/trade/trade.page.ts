import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ActivatedRoute } from '@angular/router';
import { VapaeeDEX, TokenDEX, AssetDEX } from '@vapaee/dex';
import { Subscriber } from 'rxjs';
import { VpePanelOrderEditorComponent } from 'src/app/components/vpe-panel-order-editor/vpe-panel-order-editor.component';
import { TokenOrders, Market, OrderRow } from '@vapaee/dex';
import { VpePanelWalletComponent } from 'src/app/components/vpe-panel-wallet/vpe-panel-wallet.component';
import { VpeComponentsService } from 'src/app/components/vpe-components.service';


@Component({
    selector: 'trade-page',
    templateUrl: './trade.page.html',
    styleUrls: ['./trade.page.scss', '../common.page.scss']
})
export class TradePage implements OnInit, OnDestroy {

    scope:string;
    commodity:TokenDEX;
    currency:TokenDEX;
    _orders:TokenOrders;
    timer:number;
    chartHeight: number;
    _chartData:any[][][];
    private onStateSubscriber: Subscriber<string>;
    private onBlocklistSubscriber: Subscriber<any[][]>;

    public loading: boolean;
    public error: string;

    // temporal
    public asset: AssetDEX =  new AssetDEX();

    @ViewChild(VpePanelOrderEditorComponent) orderform_min: VpePanelOrderEditorComponent;
    @ViewChild(VpePanelOrderEditorComponent) orderform_full: VpePanelOrderEditorComponent;
   
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public route: ActivatedRoute,
        public components: VpeComponentsService

    ) {
        this.chartHeight = Math.max(this.app.device.height - 430, 175); 
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
        this.commodity = await this.dex.getToken(com);
        this.currency = await this.dex.getToken(cur);
        this.dex.updateTrade(this.commodity, this.currency, updateUser);
        this.app.setGlobal("lastmarket", this.scope, true);
    }

    async init() {
        console.log("TradePage.init() <-- ");
        this.orderform_min ? this.orderform_min.reset() : null;
        this.orderform_full ? this.orderform_full.reset() : null;
        this.commodity = null;
        this.currency = null;
        this._chartData = [[]];
        
        setTimeout(_ => { this.updateAll(true); }, 0);
        this.timer = window.setInterval(_ => { this.updateAll(false); }, 15000);
    }

    async destroy() {
        // console.log("TradePage.destroy() <-- ");
        clearInterval(this.timer);
    }

    get deposits(): AssetDEX[] {
        return this.dex.deposits;
    }

    get balances(): AssetDEX[] {
        return this.dex.balances;
    }

    get market(): Market {
        var market = this.scope ? this.dex.market(this.scope) : null;
        return market;
    }

    get history() {
        var market = this.market;
        // console.log("history()",this.scope, table.scope, table.history);
        return market ? market.history : [];
    }

    get orders() {
        var market = this.market;
        return market ? market.orders : this._orders;
    }

    get buyorders() {
        var market = this.market;
        return market ? market.orders.buy : this._orders.buy;
    }

    get sellorders() {
        var market = this.market;
        return market ? market.orders.sell : this._orders.sell;
    }

    get headers() {
        var market = this.market;
        var header = { 
            sell: {total:null, orders:0}, 
            buy: {total:null, orders:0}
        }
        return market ? (market.header ? market.header : header) : header;
    }

    /*get iheaders() {
        var scope = this.dex.reverse(this.scope);
        var header = { 
            sell: {total:null, orders:0}, 
            buy: {total:null, orders:0}
        }
        return scope ? (scope.header ? scope.header : header) : header;
    }*/

    get summary() {
        var market = this.market;
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_telos.clone(),
            records: [],
            volume: this.dex.zero_telos.clone()
        }, market ? market.summary : {});
        return _summary;
        // return scope ? (scope.summary ? scope.summary : _summary) : _summary;
    }

    get chartData() {
        if (!this._chartData) this.regenerateChartData();
        return this._chartData;
    }

    get tokens() {
        return this.dex.tokens;
    }

    get markets() {
        return this.dex.topmarkets;
    }

    private regenerateChartData() {
        var market = this.market;
        if (market) {
            // console.log("-----------------------------------------");
            // console.log(this.scope, this.dex.scopes[this.scope].blocklist);
            // console.log("-----------------------------------------");
            this._chartData = market.blocklevels;

            if (
                market.blocklist.length == 0 && market.blocks > 0
            ) {
                setTimeout(_ => {
                    console.log("CHART this._chartData = [[]];");
                    this._chartData = [[]];
                }, 1200);
            }
            // console.log("this._chartData", this._chartData);
        } else {
            // console.error("No existe todavía el scope ", this.scope);
        }
    }


    ngOnDestroy() {
        this.onStateSubscriber.unsubscribe();
        this.onBlocklistSubscriber.unsubscribe();
        this.destroy();
    }

    ngOnInit() {
        this.init();
        this.app.onStateChange.subscribe(this.onStateSubscriber);
        this.dex.onTradeUpdated.subscribe(this.onBlocklistSubscriber);
    }

    onClickRow(e:{type:string, row:OrderRow}) {
        this.orderform_min.setPrice(e.row.price.clone());
        this.orderform_min.setAmount(e.row.sum.clone());
        this.orderform_min.wantsTo(e.type == "sell" ? "buy" : "sell");

        this.orderform_full.setPrice(e.row.price.clone());
        this.orderform_full.setAmount(e.row.sum.clone());
        this.orderform_full.wantsTo(e.type == "sell" ? "buy" : "sell");
    }

    onClickPrice(e) {
        this.orderform_min.setPrice(e.row.price.clone());
        this.orderform_full.setPrice(e.row.price.clone());
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

    get withdraw_error() {
        return this.dex.feed.error('withdraw');
    }

    get deposit_error() {
        return this.dex.feed.error('deposit');
    }    

    onWalletConfirmDeposit(amount: AssetDEX, wallet: VpePanelWalletComponent) {
        this.loading = true;
        this.dex.deposit(amount).then(_ => {
            this.loading = false;
            wallet.closeInputs();
        }).catch(e => {
            console.error(typeof e, e);
            this.loading = false;
        });
    }

    onWalletConfirmWithdraw(amount: AssetDEX, wallet: VpePanelWalletComponent) {
        this.loading = true;
        this.dex.withdraw(amount).then(_ => {
            this.loading = false;
            wallet.closeInputs();
        }).catch(e => {
            console.error(typeof e, e);
            this.loading = false;
        });        
    }

    gotoAccount() {
        this.app.navigate('/exchange/account/' + this.dex.current.name);
    }

    selectMarket(scope: string) {
        console.log("TradePage.selectMarket()", scope);
        this.app.navigate('/exchange/trade/' + scope);
    }

    scopeChange(scope) {
        console.log("TradePage.scopeChange()", scope);
        this.selectMarket(scope);
    }

    switchTokens() {
        this.selectMarket(this.dex.inverseScope(this.scope));
    }

}
