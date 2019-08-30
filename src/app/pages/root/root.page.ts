import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService, AnalyticsService } from 'src/app/services/common/common.services';

import { VapaeeScatter, NetworkMap } from '@vapaee/scatter';
import { VapaeeDEX } from '@vapaee/dex';
import { VpeComponentsService } from 'src/app/components/vpe-components.service';
import { HttpClient } from '@angular/common/http';
import { VapaeeStyle } from 'projects/vapaee/style/src/public_api';


declare var $:any;

@Component({
    selector: 'root-page',
    templateUrl: './root.page.html',
    styleUrls: ['./root.page.scss']
})
export class RootPage implements OnInit {

    constructor(
        public app: AppService,
        private http: HttpClient,
        public local: LocalStringsService,
        public elRef: ElementRef,
        public scatter: VapaeeScatter,
        public dex: VapaeeDEX,
        public style: VapaeeStyle,
        public analytics: AnalyticsService,
        private components: VpeComponentsService,
    ) {
        
    }
    
    ngOnInit() {

        this.http.get<NetworkMap>("assets/endpoints.json").toPromise().then((endpoints) => {
            this.scatter.setEndpoints(endpoints);

            var network = "telos-testnet";
            network = "telos";
            network = "local";
            if ( this.scatter.network.slug != network || !this.scatter.connected ) {
                this.scatter.setNetwork(network);
                this.scatter.connectApp("Vapaée - Telos DEX").catch(err => console.error(err));
            }
    
        });

        this.dex.onLoggedAccountChange.subscribe(logged => {
            this.analytics.setUserId(logged ? logged : 0);
        });

    }

    collapseMenu() {
        var target = this.elRef.nativeElement.querySelector("#toggle-btn");
        var navbar = this.elRef.nativeElement.querySelector("#navbar");
        if (target && $(navbar).hasClass("show")) {
            $(target).click();
        }
    }
    
    debug(){
        console.log("--------------------------------");
        console.log("VPE", [this.dex]);
        console.log("Scatter", [this.scatter]);
        console.log("Components", [this.components]);
        console.log("--------------------------------");
    }

}
