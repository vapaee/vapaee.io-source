import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService, AnalyticsService } from 'src/app/services/common/common.services';

import { VapaeeScatter, NetworkMap, SmartContract } from 'projects/vapaee/scatter/src';
import { VapaeeDEX } from 'projects/vapaee/dex/src';
import { VapaeeStyle } from '@vapaee/style';

import { VpeComponentsService } from 'src/app/components/vpe-components.service';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from 'src/app/services/dropdown.service';
import { TimezoneService } from 'src/app/services/timezone.service';
import { VapaeeREX } from '@vapaee/rex';

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
        public rex: VapaeeREX,
        public style: VapaeeStyle,
        public analytics: AnalyticsService,
        private components: VpeComponentsService,
        public dropdown: DropdownService,
        public timezone: TimezoneService
    ) {
        
    }
    
    ngOnInit() {

        this.http.get<NetworkMap>("assets/endpoints.json").toPromise().then((endpoints) => {
            this.scatter.setEndpoints(endpoints);

            var network = "telos-testnet";
            network = "telos";
            // network = "local";
            if (window.location.hostname == "vapaee.io") {
                network = "telos";
            }
            if ( this.scatter.network.slug != network || !this.scatter.connected ) {
                this.scatter.setNetwork(network);
                this.scatter.connectApp("Vapaée - Telos DEX").catch(err => console.error(err));
            }
    
        });

        this.dex.onLoggedAccountChange.subscribe(logged => {
            this.analytics.setUserId(logged ? logged : 0);
        });

        // ----------------------
        // this.CheckWP();
    }

    collapseMenu() {
        var target = this.elRef.nativeElement.querySelector("#toggle-btn");
        var navbar = this.elRef.nativeElement.querySelector("#navbar");
        if (target && $(navbar).hasClass("show")) {
            $(target).click();
        }
    }
    

    // -----------------------------------------------

    debug(){
        //*
        console.log("--------------------------------");
        console.log("VPE", [this.dex]);
        console.log("REX", [this.rex]);
        console.log("Scatter", [this.scatter]);
        console.log("Components", [this.components]);
        console.log("--------------------------------");
        
       /*/
       this.startCalculo();
       //*/
        
    }

    // ----------------------------------------------------------
    /*
    CheckWP() {
        this.user_voted_us = true;
        this.subscriber = new Subscriber<string>(this.onAccountChange.bind(this));
        this.dex.onCurrentAccountChange.subscribe(this.subscriber);
    }
    
    user_voted_us:boolean;
    private subscriber: Subscriber<string>;
    findOutIfUserVotedUs(account:string = null){
        var contract = this.scatter.getSmartContract("eosio.trail");
        var proposalID = "17";
        console.log("findOutIfUserVotedUs(",account,")");
        return contract.getTable("votereceipts", {table:account || this.dex.current.name, limit:1, lower_bound:proposalID}).then(result => {
            this.user_voted_us = account == "guest";
            if (result.rows.length > 0) {
                console.assert(result.rows[0].ballot_id == proposalID, result.rows[0].ballot_id, typeof result.rows[0].ballot_id, proposalID, typeof proposalID);
                if (result.rows[0].directions.length == 1 && result.rows[0].directions[0] == 1 && result.rows[0].expiration > 1571155349) {
                    console.log("YES !!!");
                    this.user_voted_us = true;
                }
            }
            
        }).catch(e => {
        });
    }

    onAccountChange(account: string) {
        return this.findOutIfUserVotedUs(account);
    }
    */


    // -----------------------------------------------
    cantidadDeCartas(album: number[]): number {
        let cant = 0;
        for (let i=0; i<album.length; i++) {
            cant += album[i];
        }
        return cant;
    }

    isFull(album: number[], cuantos:number): boolean {
        for (let i=0; i<album.length; i++) {
            if (album[i] < cuantos) return false;
        }
        return true;
    }

    abrirSobre(album: number[], cartas: number) {
        for (let i=0; i<cartas; i++) {
            album[Math.floor(album.length * Math.random())]++;
        }
        return album;
    }

    crearAlbum(size:number) {
        let album: number[] = [];
        for (let i=0; i<size; i++) { album.push(0); }
        return album;
    }

    startCalculo() {
        let resultados = [];

        setInterval(_ => {
            let album: number[] = this.crearAlbum(50);
            let cartas = 0;
            let sobres = 0;
            let max = 1000000;
            let llenos = 44000;
            let cartasXsobre = 5;
            while(!this.isFull(album, llenos)) {
                sobres++;
                album = this.abrirSobre(album, cartasXsobre);
                if (sobres >= max) break;
            }
    
            if (sobres >= max) {
                console.error("ERROR: demasiados sobres", album);
            } else {
                cartas = this.cantidadDeCartas(album);
                resultados.push({sobres, cartas});
                let promedioCartas = 0;
                let promedioSobres = 0;
                for (let i in resultados) {
                    promedioCartas += resultados[i].cartas;
                    promedioSobres += resultados[i].sobres;
                }
                promedioCartas = Math.round(promedioCartas / resultados.length);
                promedioSobres = Math.round(promedioSobres / resultados.length);
                console.log("sobres: ", sobres, "cartas: ", cartas, "- promedioSobres: ", promedioSobres, "promedioCartas: ", promedioCartas);
            }
        }, 100);
    }


}
