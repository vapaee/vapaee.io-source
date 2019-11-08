import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ETokenDEX, AssetDEX, TokenDEX, VapaeeDEX } from '@vapaee/dex';
import { Feedback } from '@vapaee/feedback';

@Component({
    selector: 'tokenedit-page',
    templateUrl: './tokenedit.page.html',
    styleUrls: ['./tokenedit.page.scss', '../common.page.scss']
})
export class TokenEditPage implements OnInit, OnDestroy, AfterViewInit {

    public stepOneSucceed: boolean;
    public feed: Feedback;
    newtoken: ETokenDEX;
    thetoken: TokenDEX;
    tab: string;
    editing: TokenDEX;
    editable: boolean;
    max_supply: number;
    prueb: number;
    TAB = {CREATE:"create", REGISTER:"register",EDIT:"edit"};
    _safe_url_cache = {};
    
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private http: HttpClient
    ) {
        this.feed = new Feedback();
        this.stepOneSucceed = false;
    }

    get form_token(): TokenDEX {
        switch(this.tab) {
            case this.TAB.CREATE:
            case this.TAB.REGISTER:
                return this.newtoken;
            case this.TAB.EDIT:
                return this.editing;
        }
        return this.newtoken;
    }

    pickToken(symbol) {
        
    }

    changeTab(tab:string) {
        if (tab == this.tab) return;
        console.log("TokenEditPage.changeTab()", this.tab, " -> ", tab);
        this.tab = tab;        
        this.stepOneSucceed = false;
        if (tab == this.TAB.EDIT && !this.editable) {
            return;
        }
        if (tab == this.TAB.CREATE) {
            this.newtoken.contract = "vapaeetokens";
            this.discardTheToken();
            this.tab = this.TAB.CREATE; 
        }
    }

    ngOnDestroy() {
    }

    ngOnInit() {
        this.init();
    }

    ngAfterViewInit () {
        
    }

    editToken(tkn:TokenDEX) {
        this.app.setGlobal("edit-token", true);
        this.app.navigate("/exchange/token/"+tkn.symbol.toLowerCase());
    }

    init() {
        var symbol = this.route.snapshot.paramMap.get('symbol') || "";
        this.newtoken = new ETokenDEX({symbol:"NEW-TOKEN", precision: 4, contract:"vapaeetokens"});
        this.max_supply = 100000000;
        this.editing = new TokenDEX();
        this.editable = false;
        if (symbol == "new-token") {
            this.tab = this.TAB.CREATE;
        } else {
            this.newtoken.symbol = symbol.toUpperCase();
            this.dex.waitTokensLoaded.then(_ => {
                var token = this.dex.getTokenNow(symbol.toUpperCase());
                if (token) {
                    this.editing = token;
                    this.thetoken = this.editing.basecopy();
                    this.editable = true;
                    this.tab = this.TAB.EDIT;
                    this.dex.waitLogged.then(_ => {
                        if (this.dex.logged == token.owner) {
                            
                        } else {
                            this.feed.setError('ownership', 'you are not the owner of this token');
                        }
                    })
                } else {
                    this.tab = this.TAB.REGISTER;
                }                
            });
        }
        this.dex.waitTokensLoaded.then(_ => this.checkToken());
    }

    get symbolIsGood(): boolean {
        var sym = this.newtoken.symbol;
        if (sym) {
            if (1 <= sym.length && sym.length <= 7) {
                for (let i=0; i<sym.length; i++) {
                    if (sym[i] < 'A' || sym[i] > 'Z') {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    discardTheToken() {
        this.thetoken = null;
        this.editable = false;
        this.editing = new TokenDEX();
        this.stepOneSucceed = false;
        this.changeTab(this.TAB.REGISTER);
    }
    
    setTradeable(tradeable:boolean) {
        this.editing.tradeable = !!tradeable;
    }
     
    onTokenInfoChange(a:any=null) {
        console.log("TokenEditPage.onTokenInfoChange()");
    }
    
    onTokenChange(a:any=null) {
        this.checkToken();
    }

    checkTimer;
    checkToken() {
        console.log("TokenEditPage.checkToken()");
        this.thetoken = null;
        this.clearError();
        clearTimeout(this.checkTimer);
        this.checkTimer = setTimeout(_ => {
            console.log("TokenEditPage.checkToken() timeout");
            if (this.symbolIsGood) {
                this.dex.waitTokensLoaded.then( _ => {
                    var tok = this.dex.getTokenNow(this.newtoken.symbol);
                    console.log("TokenEditPage.checkToken() TokensLoaded", this.newtoken.symbol, [tok]);
                    if (tok) {
                        this.thetoken = tok.basecopy();
                        this.editing = tok;
                        this.editable = true;
                        if (this.tab != this.TAB.EDIT) {
                            this.changeTab(this.TAB.EDIT);
                        }
                    } else {
                        this.dex.fetchTokenStats(this.newtoken).then( result => {
                            console.log("TokenEditPage.checkToken() ---------->", this.newtoken.stat);
                            if (this.newtoken.stat) {
                                let supply = new AssetDEX(this.newtoken.stat.max_supply);
                                this.newtoken.precision = supply.token.precision || 0;
                                this.thetoken = this.newtoken.basecopy();
                                console.log("supply", this.thetoken);
                                if (this.tab == this.TAB.CREATE) {
                                    this.changeTab(this.TAB.REGISTER);                                    
                                }
                                if (this.newtoken.contract == "vapaeetokens") {
                                    this.stepOneSucceed = true;
                                }                                
                            }
                        });                        
                    }
                })
            }
        }, 1000);
    }

    clearError() {
        this.dex.feed.setError('createtoken', null);
        this.dex.feed.setError('addtoken', null);
        this.dex.feed.setError('updatetoken', null);
        this.feed.setError('ownership', null);
    }

    get error() {
        return this.feed.error('ownership') || this.dex.feed.error('createtoken') || this.dex.feed.error('addtoken') || this.dex.feed.error('updatetoken');
    }

    get loading() {
        return this.dex.feed.loading('createtoken') || this.dex.feed.loading('addtoken') || this.dex.feed.loading('updatetoken');
    }

    get showRegisteringForm() {
        return !(this.tab == this.TAB.CREATE || !this.thetoken || this.editable || this.stepOneSucceed);
    }
    


/*
    prueba () {


        var token_a = new TokenDEX({
            banned: this.dex.telos.banned,
            banner: this.dex.telos.banner,
            brief: this.dex.telos.brief,
            contract: this.dex.telos.contract,
            currency: this.dex.telos.currency,
            data: this.dex.telos.data,
            logo: this.dex.telos.logo,
            logolg: this.dex.telos.logolg,
            markets: this.dex.telos.markets,
            owner: this.dex.telos.owner,
            precision: 0,
            stat: this.dex.telos.stat,
            website: this.dex.telos.website,
            summary: this.dex.telos.summary,
            symbol: this.dex.telos.symbol,
            title: this.dex.telos.title,
            tradeable:this.dex.telos.tradeable
        });

        var token_e = new TokenDEX(this.thetoken);
        var token_t = new TokenDEX(this.dex.telos);
        console.log("token_a", token_a);
        console.log("token_e", token_e);
        console.log("token_t", token_t);

        this.dex.addtoken(token_a).then(_ => {
            console.log("EXITO:", _);
            this.app.navigate("/exchange/tokenedit/"+this.newtoken.symbol.toLowerCase());
            this.changeTab(this.TAB.EDIT);
        }).catch(e => { console.error(e); });        
    }*/

    showerrors: boolean;
    confirm() {
        this.showerrors = true;
        switch(this.tab) {
            case this.TAB.CREATE:
                var max_supply: AssetDEX = new AssetDEX(new BigNumber(this.max_supply), this.newtoken);
                this.dex.createtoken(max_supply).then(_ => {
                    console.log("EXITO:", _);
                    this.app.navigate("/exchange/tokenedit/"+this.newtoken.symbol.toLowerCase());
                    this.changeTab(this.TAB.REGISTER);
                    this.checkToken();
                }).catch(e => { console.error(e); });
                break;
            case this.TAB.REGISTER:
                if (!this.editing.title || !this.editing.brief) {
                    return;
                }
                var token = new TokenDEX({
                    banner: this.editing.banner || "",
                    brief: this.editing.brief || "",
                    contract: this.thetoken.contract,
                    logo: this.editing.logo || "/assets/logos/no-icon.png",
                    logolg: this.editing.logolg || "/assets/logos/no-icon.png",
                    precision: this.thetoken.precision || 0,
                    website: this.editing.website || "",
                    symbol: this.thetoken.symbol,
                    title: this.editing.title || "",
                    tradeable: this.editing.tradeable || 0
                });
                this.dex.addtoken(token).then(_ => {
                    console.log("EXITO:", _);
                    this.editToken(this.newtoken);
                }).catch(e => { console.error(e); });
                break;
            case this.TAB.EDIT:
                if (!this.editing.title || !this.editing.brief) {
                    return;
                }
                var token = new TokenDEX({
                    banner: this.editing.banner || "",
                    brief: this.editing.brief || "",
                    contract: this.thetoken.contract,
                    logo: this.editing.logo || "/assets/logos/no-icon.png",
                    logolg: this.editing.logolg || "/assets/logos/no-icon.png",
                    precision: this.thetoken.precision || 0,
                    website: this.editing.website || "",
                    symbol: this.thetoken.symbol,
                    title: this.editing.title || "",
                    tradeable: this.editing.tradeable || 0
                });                
                this.dex.updatetoken(token).then(_ => {
                    console.log("EXITO:", _);
                    this.app.navigate("/exchange/token/"+this.newtoken.symbol.toLowerCase());
                }).catch(e => { console.error(e); });
                break;
        }
    }

    okConfirm() {
        if (!this.dex.logged) return false;

        switch(this.tab) {
            case this.TAB.CREATE:
                if (this.thetoken) return false;
                break;
            case this.TAB.REGISTER:
                if (!this.thetoken) return false;
                if (this.editable) return false;
                break;
            case this.TAB.EDIT:
                if (!this.thetoken) return false;
                if (!this.editable) return false;
                break;
        }
        return true;
    }
}
