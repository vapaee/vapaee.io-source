import { Component, Input, OnChanges, Output, OnInit, OnDestroy, HostBinding, TemplateRef, SimpleChange, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, AssetDEX } from '@vapaee/dex';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, Device, BoolMap } from '../vpe-components.service';
import { Subject, Subscriber } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';
import { NgModel } from '@angular/forms';

@Component({
    selector: 'vpe-token-input',
    templateUrl: './vpe-token-input.component.html',
    styleUrls: ['./vpe-token-input.component.scss']
})
export class VpeTokenInputComponent implements OnChanges, OnInit, OnDestroy {

    public input_class_obj: BoolMap                   = {};
    private prev: string                              = "";
    @Input() public asset: AssetDEX                   = new AssetDEX();
    @Input() public placeholder: string               = "";
    @Input() public button: string                    = "";
    @Input() public input_class: string | BoolMap     = "";
    @Input() public precision: number                 = -1;
    @Input() public disabled: boolean                 = false;
    @Input() public loading: boolean                  = false;
    @Input() @Output() public error: string           = "";
    @Output() changeOutside: Subject<AssetDEX>        = new Subject<AssetDEX>();
    @Output() valueChange: Subject<AssetDEX>          = new Subject<AssetDEX>();
    @Output() valueEnter: Subject<AssetDEX>           = new Subject<AssetDEX>();
    public text: string                               = "";
    @HostBinding('class') class                       = '';
    private onResizeSubscriber: Subscriber<Device>;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService,
        private modalService: NgbModal
    ) {
        this.onResizeSubscriber = new Subscriber<Device>(this.onResize.bind(this));
        this.input_class_obj = {'disabled': this.disabled, 'pointer-events-none': this.service.device.portrait};
    }

    ngOnInit() {
        // console.log("TOKENINPUT ---------------->  ngOnInit()");
        
        this.service.onResize.subscribe(this.onResizeSubscriber);
        this.onResize(this.service.device);
    }

    ngOnDestroy() {
        this.onResizeSubscriber.unsubscribe();
    }

    onResize(device:Device){
        this.class = this.service.device.class;
        // console.log("RESIZE: ", this.class);
    }

    private updateAsset(ctrl:any, text:any) {
        try {
            if (this.asset.ok && text.length > 0) {
                var newAsset = new AssetDEX(text + " " + this.asset.token.symbol, this.dex);
                this.asset.amount = newAsset.amount;
                this.notifyChanges();
            }
        } catch(e) {
            console.error(e);
        }
    }

    onEnter(event: any){
        console.error("FIJATE EL TYPE ---------------->", event);
        event.stopPropagation();
        this.notifyChanges();
        setTimeout(() => {
            this.valueEnter.next(this.asset);
        }, 0);
    }

    onClick(content: TemplateRef<any>){
        if (this.service.device.portrait) {
            console.log("Abrir modal");
            this.open(content);
        }
    }

    onChange(ctrl:NgModel, text:string) {
        if (text == "") text = "0.0";
        this.updateAsset(ctrl, text);
    }

    onBlur(ctrl:NgModel, event:FocusEvent) {
        this.notifyChanges();
    }

    private _internal_changes:boolean = false;
    notifyChanges() {
        this._internal_changes = true;
        this.ngOnChanges();
    }

    ngOnChanges(a:SimpleChanges | null = null) {
        // console.error("TOKENINPUT ---------------->  ngOnChanges()", a);

        if (a) {
            let b:SimpleChange = a.input_class
            if (b) {
                if (typeof this.input_class == "string") {
                    this.input_class_obj[this.input_class] = true;
                } else {
                    this.input_class_obj = this.input_class;
                    this.input_class_obj['disabled'] = this.disabled;
                    this.input_class_obj['pointer-events-none'] = this.service.device.portrait;
                }
                return; // Do not change text value
            }
        }


        
        if (this.asset.ok) {
            var precision = this.asset.token.precision;
            if (this.precision != -1) precision = this.precision;
            this.text = this.asset.toString(precision).split(" ")[0];
            // console.log("this.text" , this.text);
            if (this.text != this.prev) {
                this.prev = this.text;
                if (this._internal_changes) {
                    this.valueChange.next(this.asset);
                } else {
                    this.changeOutside.next(this.asset);
                }
            }    
        }
        this._internal_changes = false;

        
    }

    // modal -------------
    closeResult: string = ""; 
    open(content:TemplateRef<any>) {
        console.error("FIJATE EL TYPE ---------------->", content);
        this.typing = "";
        this.newtext = this.text;
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

    newtext: string = "";
    newasset: AssetDEX = new AssetDEX();
    typing: string = "";
    onFinish(confirm:boolean) {
        if (confirm) {
            this.updateAsset(null, this.newtext);
            this.notifyChanges();    
        }
        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll(this.asset);
        }
    }

    type(char:string, clear:boolean = false) {
        if (clear) {
            if (this.typing.length > 0) {
                console.log("this.typing: '"+ this.typing+ "'");
                this.typing = this.typing.substr(0, this.typing.length-1);
                console.log("this.typing: '"+ this.typing+ "'");
            }
            if (!this.typing) this.typing = "0";
        } else {
            if (this.typing == "0") this.typing = "";
            this.typing += char;
        }
        this.newtext = this.typing;
        
        var aux:any = null;
        try {
            aux = new BigNumber(this.newtext);
            aux = new AssetDEX(aux, this.asset.token);
            this.newasset = aux;
        } catch (e) {}
    }

    add(num:number) {
        console.log("add", num);

        this.typing = "";
        var x  = new BigNumber(this.newtext);
        x = x.plus(num);
        if (x.isLessThan(0)) {
            x = new BigNumber(0);
        }
        
        var aux = new AssetDEX(x, this.asset.token);
        this.newasset = aux;
        this.newtext = aux.valueToString(this.precision);
    }

    onKeyPressHandler(event:any) {
        return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46;
    }
}
