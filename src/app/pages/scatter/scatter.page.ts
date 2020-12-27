import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from 'src/app/services/dropdown.service';

import { VapaeeDEX, TokenDEX, TokenData, TokenEvent, AssetDEX } from '@vapaee/dex';
import { Feedback } from '@vapaee/feedback';
import { VapaeeScatter } from '@vapaee/scatter';
declare const twttr: any;


import ScatterJS from '@scatterjs/core';


@Component({
    selector: 'scatter-page',
    templateUrl: './scatter.page.html',
    styleUrls: ['./scatter.page.scss', '../common.page.scss']
})
export class ScatterPage implements OnInit, OnDestroy {
   
    
    timer: number;
    showFiller;
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: VapaeeScatter,
        public elementRef: ElementRef,
        public dex: VapaeeDEX
    ) {
        
    }

    get appname() {
        return this.app.name;
    }

    async ngOnInit() {
        console.debug("ScatterPage.ngOnInit()");
    }
    
    ngOnDestroy() {
        console.debug("ScatterPage.ngOnDestroy()");
        
    }

    async connectApp() {
        console.log("ScatterPage.connectApp()");
        await this.scatter.connectApp(this.appname);
    }

    async tryToConnect(network_slug:string) {
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> createConnexion()");
        await this.scatter.createConnexion(network_slug);
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> connect("+this.appname+")");
        this.scatter.connexion[network_slug].connect(this.appname);
        console.log("ScatterPage.tryToConnect("+network_slug+") ---> login()");
        await this.scatter.connexion[network_slug].login();
    }

    disconnectFrom(network_slug:string) {
        console.error("NOT IMPLEMENTED");
    }

    aux_transaction(slug:string) {
        console.log("aux_transaction("+slug+")");
        console.assert(typeof this.scatter.connexion[slug] != "undefined", "ERROR: connexion "+slug+" not found");

        let contract = this.scatter.connexion[slug].getContract("eosio.token");
        contract.excecute([
            {
                action: "transfer",
                payload: {
                    from: this.scatter.connexion[slug].account.name,
                    to: 'gqydoobuhege',
                    quantity: '0.0001 ' + this.scatter.connexion[slug].symbol,
                    memo: "testing",
                },
            },
            {
                action: "transfer",
                payload: {
                    from: this.scatter.connexion[slug].account.name,
                    to: 'gqydoobuhege',
                    quantity: '0.0002 ' + this.scatter.connexion[slug].symbol,
                    memo: "testing",
                },
            }
        ]);
    }

    debug() {
        console.log("--- Scatter Page ---");
        console.log(this);

        console.log("--- ScatterJS ---");
        console.log("ScatterJS.scatter.identity: ", ScatterJS.scatter.identity);
        console.log("ScatterJS.scatter.network: ", ScatterJS.scatter.network);
        console.log("ScatterJS.scatter: ", ScatterJS.scatter);

        if (this.scatter.connexion["telos"]) {
            console.log("--- Telos Connexion ---");
            this.scatter.connexion["telos"].print();
        }

        if (this.scatter.connexion["eos"]) {
            console.log("--- EOS Connexion ---");
            this.scatter.connexion["eos"].print();
        }

    }
}
