import { Component, Input, OnChanges, Output, HostBinding } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TokenDEX, VapaeeDEX } from 'projects/vapaee/dex';



@Component({
    selector: 'vpe-panel-token-selector',
    templateUrl: './vpe-panel-token-selector.component.html',
    styleUrls: ['./vpe-panel-token-selector.component.scss']
})
export class VpePanelTokenSelectorComponent implements OnChanges {

    @Input() public tokens: TokenDEX[];
    @Input() public current: TokenDEX;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;

    @Output() tokenChange: EventEmitter<TokenDEX> = new EventEmitter();
    token_filter:string;
    
    @HostBinding('class') display;
    volume_digits: number;
    price_digits: number;
    
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService,
        private modalService: NgbModal
    ) {
        this.token_filter = "";
        this.hideheader = true;
        this.margintop = true;
        this.expanded = true; 
    }

    get local_string_change () {
        if (this.display == "small" || this.display == "tiny") {
            return this.local.string.chg;
        } else {
            return this.local.string.change;
        }
    }

    async updateSize(event:ResizeEvent) {
        this.volume_digits = 4;
        this.price_digits = 8;
        
        this.display = "normal";
    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    summary(_table) {
        var table = this.dex.market(_table);
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_telos.clone(),
            records: [],
            volume: this.dex.zero_telos.clone()
        }, table ? table.summary : {});
        return _summary;
    }

    clickOnToken(token:TokenDEX) {
        console.log("VpePanelTokenSelectorComponent.clickOnToken()", token);
        this.tokenChange.next(token);
    }
    

    ngOnChanges() {
        if (!this.current && this.tokens && this.tokens.length > 0) {
            this.current = this.tokens[0];
        }
    }

    onStateChange() {

    }

    // modal -------------
    closeResult: string;
    open(content) {
        this.modalService.open(content, {centered: true}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    onTokenSelected(token:TokenDEX) {
        console.log("VpePanelTokenSelectorComponent.onTokenSelected()", token);
        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll(token);
        }
        this.clickOnToken(token);
    }
}
