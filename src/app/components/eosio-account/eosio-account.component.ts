import { Component, Input, OnChanges, Output } from '@angular/core';
import { EosioTokenMathService } from 'src/app/services/eosio.token-math.service';
import { EventEmitter } from '@angular/core';

declare var jdenticon:any;
declare var $:any;

@Component({
    selector: 'eosio-account',
    templateUrl: './eosio-account.component.html',
    styleUrls: ['./eosio-account.component.scss']
})
export class EosioAccountComponent implements OnChanges {

    @Input() public account: any;
    @Input() public symbol: string = "EOS";

    /*
    @Output() search: EventEmitter<string> = new EventEmitter<string>();
    searchBtn() {
        console.log("searchBtn() this.account.account_name", this.account.account_name);
        this.search.emit(this.account.account_name);
    }
    */
    constructor(public tokenMath: EosioTokenMathService) {
        
    }


    private extractNumber (balance) {
        if(typeof balance != "string") {
            // console.log("extractNumber() " , balance);
            return 0;
        }
        return parseFloat(balance.split(" ")[0]);
    }

    private add(balance1:string, balance2:string) {
        // console.log("add(",balance1, balance2, ")");
        var v1 = this.extractNumber(balance1), v2 = this.extractNumber(balance2);
        var tot = (v1 + v2) + "";
        if (tot.indexOf(".") != -1) {
            tot  = (tot + "0000").substr(0, tot.length + 4 - tot.indexOf("."));
        } else {
            tot  += ".0000";
        }
        tot += " " + this.symbol;
        // console.log("add(",balance1, balance2, ") --> ", tot);
        return tot;
    }

    calculateTotalBalance(account) {
        /*
        var liquid = this.extractNumber(account.core_liquid_balance);
        var refund_net = this.extractNumber(account.refund_request.net_amount);
        var refund_cpu = this.extractNumber(account.refund_request.cpu_amount);
        var self_cpu = this.extractNumber(account.self_delegated_bandwidth.cpu_weight);
        var self_net = this.extractNumber(account.self_delegated_bandwidth.net_weight);
        // console.log("TOTAL:", liquid, refund_net, refund_cpu, self_cpu, self_net);
        return liquid + refund_net + refund_cpu + self_cpu + self_net;
        */
        return this.tokenMath.addAll([
            account.core_liquid_balance,
            account.refund_request.net_amount,
            account.refund_request.cpu_amount,
            account.self_delegated_bandwidth.cpu_weight,
            account.self_delegated_bandwidth.net_weight
        ]);
    }
    
    calculateResourceLimit(limit) {
        limit = Object.assign({
            max: 0, used: 0
        }, limit);
        
        if (limit.max != 0) {
            limit.percent = 1 - (Math.min(limit.used, limit.max) / limit.max);
        } else {
            limit.percent = 0;
        }
        limit.percentStr = Math.round(limit.percent*100) + "%";
        return limit;
    }

    ngOnChanges() {
        /*
        console.log("EosioAccountComponent.ngOnChanges()", this.account, typeof this.account);
        if (this.account && typeof this.account == "object" && typeof this.account.core_liquid_balance == "string") {
            this.account.total_balance = this.calculateTotalBalance(this.account);
            this.account.loading = false;
        } else {
            this.account.loading = true;
        }
        */
        if (!this.account) return;
        if (this.account.core_liquid_balance) {
            this.symbol = this.account.core_liquid_balance.split(" ")[1];
        } else {
            this.account.core_liquid_balance = "0.0000 " + this.symbol;
        }
        
        // --
        this.account.refund_request = Object.assign({
            total: "0.0000 " + this.symbol,
            net_amount: "0.0000 " + this.symbol,
            cpu_amount: "0.0000 " + this.symbol,
            request_time: "2018-11-18T18:09:53"
        }, this.account.refund_request);
        
        this.account.refund_request.total =
            this.add(this.account.refund_request.net_amount, this.account.refund_request.cpu_amount);

        // --
        this.account.self_delegated_bandwidth = Object.assign({
            total: "0.0000 " + this.symbol,
            net_weight: "0.0000 " + this.symbol,
            cpu_weight: "0.0000 " + this.symbol
        }, this.account.self_delegated_bandwidth);

        this.account.self_delegated_bandwidth.total =
            this.add(this.account.self_delegated_bandwidth.net_weight, this.account.self_delegated_bandwidth.cpu_weight);

        // --
        this.account.total_resources = Object.assign({
            net_weight: "0.0000 " + this.symbol,
            cpu_weight: "0.0000 " + this.symbol
        }, this.account.total_resources);
        
        this.account.total_balance = this.calculateTotalBalance(this.account);
        this.account.cpu_limit = this.calculateResourceLimit(this.account.cpu_limit);
        this.account.net_limit = this.calculateResourceLimit(this.account.net_limit);
        this.account.ram_limit = this.calculateResourceLimit({
            max: this.account.ram_quota, used: this.account.ram_usage
        });

    }
}
