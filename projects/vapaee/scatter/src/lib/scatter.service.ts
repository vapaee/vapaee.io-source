import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// https://github.com/GetScatter/scatter-js#user-content-want-some-quick-code
import ScatterJS from '@scatterjs/core';

// scatter lib
import { Subject } from 'rxjs';
import { Asset } from './asset.class';
import { Token } from './token.class';
import { SmartContract } from './contract.class';
import { EOSNetworkConnexion } from './eos-connexion.class';
import { Account, AccountData, EndpointState, Network, NetworkMap, VapaeeScatterConnexion } from './types-scatter';

// @vapaee libs 
import { Feedback } from './extern';


export interface VapaeeScatterInterface {
    createConnexion: (appname:string, net_slug:string)=> Promise<VapaeeScatterConnexion>;
    getConnexion: (net_slug:string) => Promise<VapaeeScatterConnexion>;
    getNetwork: (slug: string) => Network;
    resetIdentity: () => Promise<void>;
    readonly def_account: Account;
}
export interface ConnexionMap {
    [key:string]:VapaeeScatterConnexion
};

@Injectable({
    providedIn: "root"
})
export class VapaeeScatter implements VapaeeScatterInterface /*, VapaeeScatterConnexion */ {
    
    // public appname: string;
    public connexion: ConnexionMap = {};
    public default_conn: string; // esto debería ser privado
    public onNetworkChange:Subject<Network> = new Subject();
    public feed: Feedback;

    private _networks: NetworkMap = {};
    private _networks_slugs: string[] = [];

    private setEndpointsReady: Function;
    public waitEndpoints: Promise<any> = new Promise((resolve) => {
        this.setEndpointsReady = resolve;
    });

    constructor(
        private http: HttpClient,
    ) {
        this.feed = new Feedback();
        console.log("VapaeeScatter()");
    }

    get networks(){
        return this._networks_slugs;
    }

    get def_account(): Account {
        // default data before loading data
        // TODO: fill out with better default data.
        return {
            name:'guest',
            data: {
                total_balance: "",
                total_balance_asset: new Asset(),
                total_staked: "",
                total_staked_asset: new Asset(),
                cpu_limit: {},
                net_limit: {},
                ram_limit: {},
                refund_request: {},
                total_resources: {},
                self_delegated_bandwidth: {}
            }
        }
    }    

    getNetwork(slug: string): Network {
        return this._networks[slug];
    }
    
    async init(path:string) {
        this.subscribeToEvents();
        let endpoints = await this.fetchEndpoints(path);
        this.setEndpoints(endpoints);
    }

    async subscribeToEvents() {
        let style = 'background: #28a745; color: #FFF';
        this.waitEndpoints.then(_ => console.log('%cVapaeeScatter.waitEndpoints', style));
    }    

    private async fetchEndpoints(url:string): Promise<NetworkMap> {
        this.feed.setLoading("endpoints");
        return this.http.get<NetworkMap>(url).toPromise().then((response) => {
            console.log("ScatterService.fetchEndpoints()", response);
            this.feed.setLoading("endpoints", false);
            return response;
        }).catch(e => {
            console.warn("WARNING: endpoint not responding", e);
            this.feed.setLoading("endpoints", false);
            throw e;
        });
    }

    private setEndpoints(endpoints: NetworkMap) {
        console.log("ScatterService.setEndpoints()", [endpoints]);
        this._networks = endpoints || this._networks;
        for (let slug in this._networks) {
            this._networks_slugs.push(slug);
            this.connexion[slug] = new EOSNetworkConnexion(this, slug, this.http);
        }
        this.setEndpointsReady();
    }

    async createConnexion(slug:string): Promise<VapaeeScatterConnexion> {
        console.log("ScatterService.createConnexion("+slug+")");
        this.default_conn = this.default_conn || slug;
        // this.appname = appname;
        this.feed.setLoading("connexion");
        return new Promise<VapaeeScatterConnexion>(async (resolve, reject) => {
            setTimeout(_ => {
                if (this.feed.loading("connexion")) {
                    this.feed.setLoading("connexion", false);
                    this.feed.setLoading("set-network", false);
                    reject("ScatterService.createConnexion() TIME OUT");    
                }
            }, 10 * 1000);
            await this.waitEndpoints;
            console.assert(typeof this.connexion[slug] == "object", "ERROR: inconsistency error. Connexion for " + slug + " does not exist");
            await this.connexion[slug].autoSelectEndPoint(slug);

            this.feed.setLoading("connexion", false);
            resolve(this.connexion[slug]);
        });
    };
    
    async getConnexion(slug:string = this.default_conn): Promise<VapaeeScatterConnexion> {
        console.log("ScatterService.getConnexion()", [slug]);
        return new Promise<VapaeeScatterConnexion>(async (resolve, reject) => {
            await this.waitEndpoints;
            if (!slug) {
                slug = this.default_conn;
            }            
            console.assert(typeof this.connexion[slug] == "object", "ERROR: inconsistency error. Connexion for " + slug + " does not exist");
            resolve(this.connexion[slug]);
        });
    };

    // ------------------------------------------------------------------------------------------------------------------
    // old API for retocompatibility ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------
    private get symbol(): string {
        return this.networks[this.default_conn].symbol;
    }

    /*private async aux_default_async_call(function_name:string, params:any[] = []): Promise<any> {
        await this.waitEndpoints;

        console.log("aux_default_async_call("+function_name+") luego del waitEndpoints", params);

        console.assert(typeof this.default_conn == "string", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this._networks[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn][function_name] == "function", "ERROR: inconsistency error! " + function_name + " does not exist in connexion object");
        let func:Function = this.connexion[this.default_conn][function_name];
        let result = await func.call(this.connexion[this.default_conn], params);
        return result;
    }*/

    private aux_default_call(function_name:string, params:any[] = []): any {
        console.assert(typeof this.default_conn == "string", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        let func:Function = this.connexion[this.default_conn][function_name];
        let result = func.call(this.connexion[this.default_conn], params);
        return result;
    }

    private async aux_asserts(function_name:string) {
        await this.waitEndpoints;
        console.assert(typeof this.default_conn == "string", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this._networks[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn] != "undefined", "ERROR: MUST call setNetwork(network_slug:string) before calling " + function_name);
        console.assert(typeof this.connexion[this.default_conn][function_name] == "function", "ERROR: inconsistency error! " + function_name + " does not exist in connexion object");

    }

    async setNetwork(slug:string) {
        console.warn("ScatterService.setNetwork("+slug+") DEPRECATED ");
        this.feed.setLoading("set-network", false);
        return this.waitEndpoints.then(async () => {
            let connexion = this.connexion[slug];
            console.assert(typeof connexion == "object", "ERROR: inconsistency error. Connexion for " + slug + " does not exist");
            if (!this.default_conn || this.default_conn != slug) {
                this.default_conn = slug;
                this.onNetworkChange.next(this.getNetwork(slug));
            }            
            await connexion.autoSelectEndPoint(slug);
            // await this.resetIdentity();
            // await this.initScatter();

            this.feed.setLoading("set-network", false);
            return connexion;
        });
    }
    
    // Connexion ------------------------------------------
    async connect(appname:string) {
        await this.aux_asserts("connect");
        return this.connexion[this.default_conn].connect(appname);
    }

    // Acount, Identity and authentication -----------------
    async resetIdentity() {
        ScatterJS.forgetIdentity();
        for (let i in this.connexion) {
            this.connexion[i].resetIdentity();
        }
        
    }
    async updateAccountData() {
        await this.aux_asserts("updateAccountData");
        return this.connexion[this.default_conn].updateAccountData();
    }

    // Networks (eosio blockchains) & Endpoints -----------------
    async autoSelectEndPoint(slug:string): Promise<EndpointState> {
        await this.aux_asserts("autoSelectEndPoint");
        return this.connexion[this.default_conn].autoSelectEndPoint(slug);        
    }

    
    // Scatter initialization and AppConnection -----------------
    async initScatter() {
        await this.aux_asserts("initScatter");
        return this.connexion[this.default_conn].initScatter();
    }
    async retryConnectingApp() {
        await this.aux_asserts("retryConnectingApp");
        return this.connexion[this.default_conn].retryConnectingApp();
    }
    async connectApp(appname:string) {
        await this.aux_asserts("connectApp");
        return this.connexion[this.default_conn].connectApp(appname);
    }
    

    // AccountData and Balances ---------------------------------
    calculateTotalBalance(account) {
        return new Asset("0.0000 " + this.symbol)
            .plus(account.core_liquid_balance_asset)
            .plus(this.calculateTotalStaked(account));
    }

    calculateTotalStaked(account) {
        return new Asset("0.0000 " + this.symbol)
            .plus(account.refund_request.connexion_amount_asset)
            .plus(account.refund_request.cpu_amount_asset)
            .plus(account.self_delegated_bandwidth.cpu_weight_asset)
            .plus(account.self_delegated_bandwidth.connexion_weight_asset);
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

    async queryAccountData (name:string): Promise<AccountData> {
        await this.aux_asserts("queryAccountData");
        return this.connexion[this.default_conn].queryAccountData(name);
    }

    async executeTransaction(contract:string, action:string, data:any): Promise<any>{
        await this.aux_asserts("executeTransaction");
        return this.connexion[this.default_conn].executeTransaction(contract, action, data);
    }

    async getContractWrapper(account_name:string): Promise<SmartContract> {
        await this.aux_asserts("getContract");
        return Promise.resolve(this.connexion[this.default_conn].getContract(account_name));
    }
    
    // loginTimer;
    async login() {
        await this.aux_asserts("login");
        return this.connexion[this.default_conn].login();
    }

    async logout() {
        await this.aux_asserts("logout");
        return this.connexion[this.default_conn].logout();
    }

    async getTableRows (contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos): Promise<any> {
        await this.aux_asserts("getTableRows");
        return this.connexion[this.default_conn].getTableRows(contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos);
    }

    isNative (thing: Asset | Token): boolean {
        return this.connexion[this.default_conn].isNative(thing);
        
    }

}
