import { Component, Input, OnChanges, Output, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, StringMap, ResizeEvent } from '../vpe-components.service';
import { Subscriber } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { EventLog, VapaeeDEX } from '@vapaee/dex';



@Component({
    selector: 'vpe-panel-activity-log',
    templateUrl: './vpe-panel-activity-log.component.html',
    styleUrls: ['./vpe-panel-activity-log.component.scss']
})
export class VpePanelActivityLogComponent implements OnChanges, OnInit, OnDestroy {

    @Output() gotoAccount: EventEmitter<string> = new EventEmitter();
    @Output() gotoTable: EventEmitter<string>   = new EventEmitter();
    @Input() lines: number                      = 1;
    @Input() public hideheader: boolean         = false;
    @Input() public margintop:  boolean         = true;
    @Input() public expanded:   boolean         = true;
    detail: StringMap                           = {};
    data: {[key:string]:StringMap}              = {};
    list: EventLog[]                            = [];
    obj: {[key:string]:string}                  = {"max-height": "250px", "max-width": "100%"};

    @ViewChild('sp') sp: PerfectScrollbarComponent = <PerfectScrollbarComponent>{};
    
    private onLocalChangeSubscriber: Subscriber<string>;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService,
        private cdr: ChangeDetectorRef
    ) {
        this.onLocalChangeSubscriber = new Subscriber<string>(this.onLocalChange.bind(this));
    }
    
    _ps_height: number = 0;
    get ps_style() {
        this.obj = {"max-height": "250px", "max-width": "100%"};
        if (this.lines == 1) {
            this.obj["max-height"] = "250px"
        } else {
            this.obj["max-height"] = this._ps_height+"px";
        };
        return this.obj;
    }

    get activity() {
        return this.dex.activity.list;
    }

    async updateSize(event:ResizeEvent) {
        this._ps_height = event.device.height - 50;
    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        // this.dex.activity.events[""].processed
    }

    onLocalChange() {
        this.detail = {};
    }
    
    ngOnDestroy() {
        this.onLocalChangeSubscriber.unsubscribe();
    }

    ngOnInit() {
        this.local.onLocalChange.subscribe(this.onLocalChangeSubscriber);
    }

    getCanonicalTable(name: string): string {
        var parts:string[] = name.split(".");
        if (parts[1] == "tlos") return name;
        if (parts[0] == "tlos") return parts[1] + "." + parts[0];
        if (parts[0] < parts[1]) return name;
        return parts[1] + "." + parts[0];
    }

    getOrdertype(e:EventLog) {
        var data:StringMap = this.extractEventData(e);
        return data.ordertype;
    }

    getOrderTable(e:EventLog) {
        var data:StringMap = this.extractEventData(e);
        return data.table;
    }

    extractEventData(e:EventLog) {
        var id = "id-" + e.id;
        if (!this.data[id]) {
            var parts:string[] = e.params.split("|");;
            var data:StringMap = {user: e.user};
            
            switch(e.event) {
                case "deposit":
                    // kate|900.00000000 CNT
                    data.amount = parts[1];
                    break;
                case "withdraw":
                    // 900.00000000 CNT
                    data.amount = parts[0];
                    break;
                case "sell.order":
                    // 10.00000000 CNT|0.29000000 TLOS
                    data.ordertype = this.local.string.sellorder;
                    data.amount = parts[0];
                    data.price = parts[1];
                    break;
                case "buy.order":
                    // 20.00000000 CNT|0.40000000 TLOSç
                    data.ordertype = this.local.string.buyorder;
                    data.amount = parts[0];
                    data.price = parts[1];
                    break;
                case "deal":
                    // user: kate
                    // compra: cnt.tlos|kate|alice|10.00000000 CNT|4.00000000 TLOS|0.40000000 TLOS
                    // venta:  cnt.tlos|alice|kate|10.00000000 CNT|2.90000000 TLOS|0.29000000 TLOS
                    data.table = parts[0];
                    data.buyer = parts[1];
                    data.seller = parts[2];
                    data.amount = parts[3];
                    data.payment = parts[4];
                    data.price = parts[5];
                    if (data.table == this.dex.canonicalName(data.table)) {
                        data.ordertype = (e.user == data.seller) ? "sell" : "buy";
                    } else {
                        data.ordertype = (e.user != data.seller) ? "sell" : "buy";
                    }
                    break;
                case "cancel.order":
                    // cancel sell order: cnt.tlos|1
                    // cancel buy order: tlos.cnt|1
                    data.table = parts[0];
                    data.canonical = this.getCanonicalTable(data.table);
                    data.commodity = data.canonical.split(".")[0].toUpperCase();
                    data.currency = data.canonical.split(".")[1].toUpperCase();
                    data.quantity = parts[1];

                    if (data.quantity == "1") {
                        if (data.table == data.canonical) {
                            data.ordertype = this.local.string.sellorder;
                        } else {
                            data.ordertype = this.local.string.buyorder;
                        }
                    } else {
                        if (data.table == data.canonical) {
                            data.ordertype = this.local.string.sellorders;
                        } else {
                            data.ordertype = this.local.string.buyorders;
                        }
                    }                    
                    break;
                default:
                    
            }
            this.data[id] = data;
        }        
        return this.data[id];        
    }

    eventDetail(e:EventLog) {
        var id = "id-" + e.id;
        if (!this.detail[id]) {
            var str:string;
            var parts:string[] = e.params.split("|");;
            var data:StringMap = this.extractEventData(e);
            
            switch(e.event) {
                case "deposit":
                    str = this.local.string.logDeposit;
                    break;
                case "withdraw":
                    str = this.local.string.logWithdraw;
                    break;
                case "sell.order":
                    str = this.local.string.logOrder;
                    break;
                case "buy.order":
                    str = this.local.string.logOrder;
                    break;
                case "deal":
                    if (data.ordertype == "sell") {
                        str = this.local.string.logTrxSell;
                    } else {
                        str = this.local.string.logTrxBuy;
                    }
                    break;
                case "cancel.order":
                    if (data.quantity == "1") {                       
                        str = this.local.string.logCancel;
                    } else {
                        str = this.local.string.logCancelN;
                    }                    
                    break;
                default:
                    str = e.params;
            }
            this.detail[id] = this.local.merge(str, data);
        }        
        return this.detail[id];
    }

    clickOnAccount(name:string) {
        this.gotoAccount.next(name);
    }

    clickOnTable(table:string) {
        this.gotoTable.next(table)
    }

    psYReachEnd() {
        this.dex.loadMoreActivity().then(_ => {
            this.cdr.detectChanges();
        });
    }
}
