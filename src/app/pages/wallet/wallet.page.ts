import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';

import { VapaeeIdentityProviderClass, VapaeeWallet } from '@vapaee/wallet';
declare const twttr: any;

@Component({
    selector: 'wallet-page',
    templateUrl: './wallet.page.html',
    styleUrls: ['./wallet.page.scss', '../common.page.scss']
})
export class WalletPage implements OnInit, OnDestroy {
   
    
    timer: number;
    showFiller;
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public wallet: VapaeeWallet,
        public elementRef: ElementRef
    ) {
        
    }

    get appname() {
        return this.app.name;
    }

    async ngOnInit() {
        console.debug("walletPage.ngOnInit()");
    }
    
    ngOnDestroy() {
        console.debug("walletPage.ngOnDestroy()");
        
    }

    async connectApp() {
        console.log("walletPage.connectApp() NOT IMLPEMENTED");
        // await this.wallet.c(this.appname);
    }

    async tryToConnect(network_slug:string, identity_provider_class:VapaeeIdentityProviderClass) {
        console.log("walletPage.tryToConnect("+network_slug+") ---> createConnexion()");
        await this.wallet.createConnexion(network_slug, identity_provider_class);
        console.log("walletPage.tryToConnect("+network_slug+") ---> connect("+this.appname+")");
        this.wallet.connexion[network_slug].connect(this.appname);
        console.log("walletPage.tryToConnect("+network_slug+") ---> login()");
        await this.wallet.connexion[network_slug].login();
    }

    disconnectFrom(network_slug:string) {
        console.error("NOT IMPLEMENTED");
    }

    aux_transaction(slug:string) {
        console.log("aux_transaction("+slug+")");
        console.assert(typeof this.wallet.connexion[slug] != "undefined", "ERROR: connexion "+slug+" not found");

        let contract = this.wallet.connexion[slug].getContract("eosio.token");
        contract.excecute([
            {
                action: "transfer",
                payload: {
                    from: this.wallet.connexion[slug].account.name,
                    to: 'gqydoobuhege',
                    quantity: '0.0001 ' + this.wallet.connexion[slug].symbol,
                    memo: "testing",
                },
            },
            {
                action: "transfer",
                payload: {
                    from: this.wallet.connexion[slug].account.name,
                    to: 'gqydoobuhege',
                    quantity: '0.0002 ' + this.wallet.connexion[slug].symbol,
                    memo: "testing",
                },
            }
        ]);
    }

    debug() {
        console.log("--- wallet Page ---");
        console.log(this);

        if (this.wallet.connexion["telos"]) {
            console.log("--- Telos Connexion ---");
            this.wallet.connexion["telos"].print();
        }

        if (this.wallet.connexion["eos"]) {
            console.log("--- EOS Connexion ---");
            this.wallet.connexion["eos"].print();
        }

    }
}
