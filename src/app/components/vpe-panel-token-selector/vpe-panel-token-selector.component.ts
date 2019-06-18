import { Component, Input, OnChanges, Output, HostBinding, Inject } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Token } from 'src/app/services/utils.service';
import { Subscriber } from 'rxjs';
import { VapaeeService, TableMap } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'vpe-panel-token-selector',
    templateUrl: './vpe-panel-token-selector.component.html',
    styleUrls: ['./vpe-panel-token-selector.component.scss']
})
export class VpePanelTokenSelectorComponent implements OnChanges {

    @Input() public tokens: Token[];
    @Input() public current: Token;
    // @Input() public comodity: Token;
    // @Input() public currency: Token;    
    @Input() public scopes: TableMap;
    @Input() public hideheader: boolean;
    @Output() selectToken: EventEmitter<string> = new EventEmitter();
    token_filter:string;
    
    @HostBinding('class') display;
    volume_digits: number;
    price_digits: number;
    
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService,
        private modalService: NgbModal
    ) {
        this.token_filter = "";
        this.hideheader = true;
    }

    get get_tokens() {
        var tokens = []
        for (var i in this.tokens) {
            var token = this.tokens[i];
            if (token.verified) {
                tokens.push(token);
            }
        }
        return tokens
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

    summary(_scope) {
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

    clickOnToken(scope:string) {
        this.selectToken.next(scope);
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

    onTokenSelected(e) {
        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll(e);
        }
        this.clickOnToken(e);
    }
}
