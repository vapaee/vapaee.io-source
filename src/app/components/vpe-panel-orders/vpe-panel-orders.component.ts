import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TokenOrders, VapaeeService, OrderRow, TableHeader } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';


@Component({
    selector: 'vpe-panel-orders',
    templateUrl: './vpe-panel-orders.component.html',
    styleUrls: ['./vpe-panel-orders.component.scss']
})
export class VpePanelOrdersComponent implements OnChanges {

    @Input() public orders: TokenOrders;
    @Input() public headers: TableHeader;
    @Input() public iheaders: TableHeader;
    @Output() onClickRow: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    @Output() onClickPrice: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        
    }

    ngOnChanges() {

    }

    clickRow(type:string, row:OrderRow) {
        this.onClickRow.next({type: type, row: row});
    }

    clickPrice(type:string, row:OrderRow) {
        this.onClickPrice.next({type: type, row: row});
    }
}
