import { Subject } from 'rxjs';
import { Asset } from './asset.class';
import { Account, AccountData, Endpoint, EndpointState, Eosconf, GetInfoResponse, Limit, Network, 
        VapaeeScatterConnexion, EOS, ScatterIdentity, ScatterNetwork, Transaction } from './types-scatter2';
import { Token } from './token.class';
import { ScatterUtils } from './utils.class';

import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { JsonRpc, Api } from 'eosjs';
import { HttpClient } from '@angular/common/http';
import { VapaeeScatterInterface } from './scatter2.service';
import { SmartContract } from './contract.class';

// @vapaee libs 
import { Feedback } from './extern';
import { Scatter } from '@vapaee/scatter2';



export class EOSNetworkConnexion implements VapaeeScatterConnexion { 
    error: string;
    symbol: string;
    feed: Feedback;
    private lib: Scatter;
    onEndpointChange:Subject<EndpointState> = new Subject<EndpointState>();
    onLogggedStateChange:Subject<boolean> = new Subject<boolean>();
    // _account: Account;
    private setReady: Function;
    public waitReady: Promise<any> = new Promise((resolve) => {
        this.setReady = resolve;
    });
    private setLogged: Function;
    public waitLogged: Promise<any> = new Promise((resolve) => {
        this.setLogged = resolve;
    });
    private setConnected: Function;
    public waitConnected: Promise<any> = new Promise((resolve) => {
        this.setConnected = resolve;
    });
    private setRPC: Function;
    public waitRPC: Promise<any> = new Promise((resolve) => {
        this.setRPC = resolve;
    });
    private setEosconf: Function;
    public waitEosconf: Promise<any> = new Promise((resolve) => {
        this.setEosconf = resolve;
    });
    

    utils:ScatterUtils;
    account: Account
    

    networks: string[];

    username: string;
    authorization: {authorization:string[]};
    

    // private _network: Network;
    public eosconf: Eosconf;
    public eos: EOS = null;
    public rpc: JsonRpc = null;
    public _connected: boolean;
    public scatter_network: ScatterJS.Network;
    public appname:string = null;
    public ScatterJS: any;
    private _account_queries: {[key:string]:Promise<AccountData>} = {};

    constructor(
        public scatter: VapaeeScatterInterface,
        public slug: string,
        public http: HttpClient
    ) {
        this.ScatterJS = ScatterJS;
        this.feed = new Feedback();
        this.utils = new ScatterUtils();
        
        ScatterJS.plugins( new ScatterEOS() );
        this.symbol = this.scatter.getNetwork(slug).symbol; 
        this.subscribeToEvents();
    }

    async subscribeToEvents() {
        let style = 'background: #a74528; color: #FFF';
        this.waitConnected.then(_ => console.log('%cEOSNetworkConnexion.waitConnected', style));
        this.waitEosconf.then(_ => console.log('%cEOSNetworkConnexion.waitEosconf', style));
        this.waitLogged.then(_ => console.log('%cEOSNetworkConnexion.waitLogged', style));
        this.waitRPC.then(_ => console.log('%cEOSNetworkConnexion.waitRPC', style));
        this.waitReady.then(_ => console.log('%cEOSNetworkConnexion.waitReady', style));
    } 

    get logged() {
        return !!this.account;
    }   

    get connected() {
        return this._connected;
    }

    get def_account(): Account {
        return this.scatter.def_account;
    }

    getContract(account: string): SmartContract {
        return new SmartContract(account, this);
    }

    async assertContext() {
        return new Promise(r => {
            if (ScatterJS.scatter.network && ScatterJS.scatter.network.chainId != this.scatter.getNetwork(this.slug).chainId) {
                console.log("ScatterJS changning context to " + this.scatter.getNetwork(this.slug).slug );
                this.scatter.resetIdentity();
                setTimeout(() => r(), 1500);
            } else {
                r();
            }    
        });
    }
    
    private async createRPC() {
        console.debug("EOSNetworkConnexion.createRPC()");
        
        return new Promise(async (resolve, reject) => {
            await this.waitEosconf;
            await this.delay(1000);

            this.scatter_network = ScatterJS.Network.fromJson(this.eosconf);
            this.rpc = new JsonRpc(this.scatter_network.fullhost());
            this.setRPC();
    
            console.log("this.scatter_network",this.scatter_network);
            console.log("rpc", this.rpc);
            console.log("ScatterJS",ScatterJS);
            resolve();            
        });
    }

    private async assertConnected(func:string) {
        console.debug("EOSNetworkConnexion.assertConnected()", typeof this.eos, [this.eos]);
        if (!this.connected) {
            if (!this.appname) throw "ERROR: You have to connect to @vapaee/scatter2 before calling " + func + "()";
            await this.connectToScatter(this.appname);
        }
        return this.waitConnected;
    }
    
    private async connectToScatter(appname: string) {
        console.debug("EOSNetworkConnexion.connectToScatter("+appname+")");
        const connectionOptions = {initTimeout:1800, network:this.scatter_network};
        return new Promise(async (resolve, reject) => {
            await this.assertContext();

            // try to connect
            console.log("ScatterJS.connect('"+appname+"', connectionOptions)...");
            ScatterJS.connect(appname, connectionOptions).then(async connected => {
                console.log("ScatterJS.connect("+appname+", connectionOptions) -> ", connected);
                this._connected = connected;
                if(!this.connected) {
                    let error = "ScatterJS.connect("+appname+",{this.scatter_network}) -> connected: false ";
                    console.error('No scatter :(');
                    reject(error);
                    this.feed.setLoading("connecting", false);
                    return;
                }
            
                this.eos = <EOS>ScatterJS.eos(this.scatter_network, Api, {rpc:this.rpc});            
                this.lib = ScatterJS.scatter;
                console.log("ScatterJS.eos()", this.eos);
                console.log("ScatterJS.scatter", this.lib);
                await this.delay(2000);
                this.setConnected();
                resolve();
                this.feed.setLoading("connecting", false);
            }).catch(e => {
                console.error("ERROR: ScatterJS.connect("+appname+", connectionOptions) failed", e);
                reject(e);
                this.feed.setLoading("connecting", false);
            })
        });
    }
    
    async connect(appname:string) {
        this.appname = appname;
        
        console.debug("EOSNetworkConnexion.connect("+appname+")");
        console.log(this);

        this.feed.setLoading("connecting");

        return this.createRPC().then(_ => {
            return this.connectToScatter(appname);
        });
    }

    async sendTransaction(trx: Transaction) {
        console.log("EOSNetworkConnexion.sendTransaction()", trx);
        this.feed.setLoading("transaction");
        return new Promise(async (resolve, reject) => {
            await this.waitLogged;

            let actions = [];

            for (let i=0; i<trx.length; i++) {
                let action = trx[i];
                actions.push({
                    account: action.contract,
                    name: action.action,
                    authorization: [{
                        actor: this.account.name,
                        permission: this.account.authority,
                    }],
                    data: action.payload
                });
            }

            console.log("EOSNetworkConnexion.sendTransaction() actions: ", actions);
            // TODO-EOS
            this.eos.transact({
                actions: actions
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then(res => {
                console.log('sent: ', res);
                this.feed.setLoading("transaction", false);
                resolve(res);
            }).catch(err => {
                console.error('error: ', err);
                this.feed.setLoading("transaction", false);
                this.feed.setError("transaction", err.message);
                reject(err);
            })

        });        
    }

    // get network(): Network {
    //     return this._network;
    // }

    private async delay(milisec:number) {
        console.log("sleep...");
        return new Promise(r => {
            setTimeout(() => r(), milisec);
        });
    };

    print() {
        console.log("Connexion: ", this);
        // console.log("ScatterJS.scatter.identity: ", ScatterJS.scatter.identity);
        // console.log("ScatterJS.scatter.network: ", ScatterJS.scatter.network);
        // console.log("ScatterJS: ", ScatterJS);
    }

    // Acount, Identity and authentication -----------------

    private async setIdentity(identity:any) {
        await this.waitConnected;
        console.log("ScatterService.setIdentity()", [identity]);
        console.assert(!!this.lib, "ERROR: no instance of ScatterJS.scatter found");
        this.error = "";
        this.lib.identity = identity;
        this.lib.forgotten = false;
        let network:Network = this.scatter.getNetwork(this.slug);
        this.account = this.lib.identity.accounts.find(x => x.chainId === network.chainId);
        this.setLogged();
        console.error("AAAAAAAAAAAAAAAAAAA");
        this.updateAccountData();
    }

    resetIdentity() {
        console.log("EOSNetworkConnexion.resetIdentity()");
        delete this.account;
        console.log("this.onLogggedStateChange.next(true); EVENT");
        console.error("AAAAAAAAAAAAAAAAAAA");
        this.onLogggedStateChange.next(true);
    }
    updateAccountData() {
        console.log("EOSNetworkConnexion.updateAccountData()");
        this.queryAccountData(this.account.name).then(account => {
            this.account.data = account;
            console.log("this.onLogggedStateChange.next(true); EVENT");
            console.error("AAAAAAAAAAAAAAAAAAA");
            this.onLogggedStateChange.next(true);
        }).catch(_ => {
            this.account.data = this.def_account.data;
            console.log("this.onLogggedStateChange.next(true); EVENT");
            console.error("AAAAAAAAAAAAAAAAAAA");
            this.onLogggedStateChange.next(true);
        });        
    };

    // Networks (eosio blockchains) & Endpoints -----------------
    autoSelectEndPoint (slug:string): Promise<EndpointState> {
        console.log("EOSNetworkConnexion.autoSelectEndPoint()");
        return new Promise((resolve, reject) => {
            let promises:Promise<EndpointState>[] = [];

            // Iterate over endponits and get the first one responding
            if (this.scatter.getNetwork(slug)) {
                let endpoints: Endpoint[] = this.scatter.getNetwork(slug).endpoints;
                for (let i=0; i<endpoints.length; i++) {
                    let endpoint: Endpoint = endpoints[i];
                    promises.push(this.testEndpoint(endpoint, i));
                }
            }

            return Promise.race(promises).then(result => {
                let n = this.extractEosconfig(result.index);
                if (n) {
                    if (!this.eosconf || this.eosconf.host != n.host) {
                        this.eosconf = n;
                        this.setEosconf();
                        // console.log("Selected Endpoint: ", this.eosconf.host);
                        // this.resetIdentity();
                        // this.initScatter();
                        this.onEndpointChange.next(result);
                    }
                    resolve(result);
                } else {
                    console.error("ERROR: can't resolve endpoint", result);
                }
                
            });
        });

    }
    private testEndpoint(endpoint: Endpoint, index:number = 0) {
        console.log("EOSNetworkConnexion.testEndpoint()", endpoint.host);
        return new Promise<EndpointState>((resolve) => {
            let url = endpoint.protocol + "://" + endpoint.host + ":" + endpoint.port + "/v1/chain/get_info";
            this.http.get<GetInfoResponse>(url).toPromise().then((response) => {
                console.log("EOSNetworkConnexion.testEndpoint()", endpoint.host, " -> ", response.chain_id);
                resolve({index, endpoint, response});
            }).catch(e => {
                console.warn("WARNING: endpoint not responding", e);
            });
        });
    }

    private extractEosconfig(index: number): Eosconf {
        console.log("EOSNetworkConnexion.extractEosconfig()", index);
        let endpoint = this.scatter.getNetwork(this.slug).endpoints[index];
        if (!endpoint) return null;
        let eosconf = {
            blockchain: "eos",
            chainId: this.scatter.getNetwork(this.slug).chainId,
            host: endpoint.host,
            port: endpoint.port,
            protocol: endpoint.protocol,
        }
        return eosconf;
    }

    
    // Scatter initialization and AppConnection -----------------
    initScatter() {
        console.error("EOSNetworkConnexion.initScatter() NOT IMPLEMENTED");
    };
    retryConnectingApp() {
        console.error("EOSNetworkConnexion.retryConnectingApp() NOT IMPLEMENTED");
    };
    async connectApp(appTitle:string = "") {
        console.log("EOSNetworkConnexion.connectApp("+appTitle+")");
        this.feed.setLoading("connect-app");
        return new Promise(async (res, rej) => {
            try {
                await this.connect(appTitle);
                await this.login();
                res();
            } catch(e) {
                console.error("ERROR: connect()", e);
                rej(e);
            }
    
            this.feed.setLoading("connect-app", false);    
        });
    }
    

    // AccountData and Balances ---------------------------------
    calculateTotalBalance(account:AccountData): Asset {
        console.log("EOSNetworkConnexion.calculateTotalBalance("+account+")");
        return new Asset("0.0000 " + this.symbol)
            .plus(account.core_liquid_balance_asset)
            .plus(this.calculateTotalStaked(account));
    }

    calculateTotalStaked(account:AccountData): Asset {
        console.log("EOSNetworkConnexion.calculateTotalStaked("+account+")");
        return new Asset("0.0000 " + this.symbol)
            .plus(account.refund_request.net_amount_asset)
            .plus(account.refund_request.cpu_amount_asset)
            .plus(account.self_delegated_bandwidth.cpu_weight_asset)
            .plus(account.self_delegated_bandwidth.net_weight_asset);
    }

    calculateResourceLimit(limit) {
        console.log("EOSNetworkConnexion.calculateResourceLimit()");
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

    queryAccountData(name:string): Promise<AccountData> {
        /*
        // get_table_rows
            code: "eosio"
            index_position: 1
            json: true
            key_type: "i64"
            limit: -1
            lower_bound: null
            scope: "gqydoobuhege"
            table: "delband"
            table_key: ""
        */
        console.log("EOSNetworkConnexion.queryAccountData("+name+") ");
        // console.error("EOSNetworkConnexion.queryAccountData() CHECK POINT 1");

        this._account_queries[name] = this._account_queries[name] || new Promise<AccountData>((resolve, reject) => {
            // console.log("PASO 1 ------", [this._account_queries])
            this.waitRPC.then(() => {
                // console.log("PASO 2 (eosjs) ------");
                
                //*
                // eosjs2




                // console.error("EOSNetworkConnexion.queryAccountData()  CHECK POINT - this.rpc.get_account("+name+") ");
                this.rpc.get_account(name).
                /*/
                // eosjs
                this.eos.getAccount({account_name: name}).
                //*/
                
                then((response) => {
                    // console.error("--------------- EOSNetworkConnexion.queryAccountData() CHECK POINT ----------------------");
                    console.log("PASO 3 (eosjs.getAccount) ------", response);
                    let account_data: AccountData = <AccountData>response;

                    if (account_data.core_liquid_balance) {
                        if (this.symbol != account_data.core_liquid_balance.split(" ")[1]) {
                            console.error("endpoint has native token", this.symbol, "but account data saids", account_data.core_liquid_balance.split(" ")[1]);
                        }
                        this.symbol = account_data.core_liquid_balance.split(" ")[1];
                    } else {
                        account_data.core_liquid_balance = "0.0000 " + this.symbol;
                    }
                    account_data.core_liquid_balance_asset = new Asset(account_data.core_liquid_balance);
                    

                    // ----- refund_request -----
                    account_data.refund_request = account_data.refund_request || {
                        total: "0.0000 " + this.symbol,
                        net_amount: "0.0000 " + this.symbol,
                        cpu_amount: "0.0000 " + this.symbol,
                        request_time: "2018-11-18T18:09:53"
                    }
                    account_data.refund_request.cpu_amount_asset = new Asset(account_data.refund_request.cpu_amount);
                    account_data.refund_request.net_amount_asset = new Asset(account_data.refund_request.net_amount);
                    account_data.refund_request.total_asset = 
                        account_data.refund_request.cpu_amount_asset.plus(account_data.refund_request.net_amount_asset)
                    account_data.refund_request.total = account_data.refund_request.total_asset.toString();
                        
                    // ----- self_delegated_bandwidth ----
                    account_data.self_delegated_bandwidth = account_data.self_delegated_bandwidth || {
                        total: "0.0000 " + this.symbol,
                        net_weight: "0.0000 " + this.symbol,
                        cpu_weight: "0.0000 " + this.symbol
                    }                    
                    account_data.self_delegated_bandwidth.net_weight_asset = new Asset(account_data.self_delegated_bandwidth.net_weight);
                    account_data.self_delegated_bandwidth.cpu_weight_asset = new Asset(account_data.self_delegated_bandwidth.cpu_weight);
                    account_data.self_delegated_bandwidth.total_asset = 
                        account_data.self_delegated_bandwidth.cpu_weight_asset.plus(account_data.self_delegated_bandwidth.net_weight_asset);
                    account_data.self_delegated_bandwidth.total = account_data.self_delegated_bandwidth.total_asset.toString();
                    

                    // ----- total_resources -----
                    account_data.total_resources = account_data.total_resources || {
                        net_weight: "0.0000 " + this.symbol,
                        cpu_weight: "0.0000 " + this.symbol
                    }
                    account_data.total_resources.net_weight_asset = new Asset(account_data.total_resources.net_weight);
                    account_data.total_resources.cpu_weight_asset = new Asset(account_data.total_resources.cpu_weight);

                    account_data.total_balance_asset = this.calculateTotalBalance(account_data);
                    account_data.total_balance = account_data.total_balance_asset.toString();

                    account_data.total_staked_asset = this.calculateTotalStaked(account_data);
                    account_data.total_staked = account_data.total_staked_asset.toString();

                    account_data.cpu_limit = this.calculateResourceLimit(account_data.cpu_limit);
                    account_data.net_limit = this.calculateResourceLimit(account_data.net_limit);
                    account_data.ram_limit = this.calculateResourceLimit({
                        max: account_data.ram_quota, used: account_data.ram_usage
                    });


                    // console.log("-------------------------------");
                    // console.log("account_data: ", account_data);
                    // console.log("-------------------------------");
                    // console.error("EOSNetworkConnexion.queryAccountData() CHECK POINT 2", [account_data]);
                    resolve(account_data);
                }).catch((err) => {
                    console.error("EOSNetworkConnexion.queryAccountData() ERROR", err);
                    reject(err);
                });
                
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });

        let promise = this._account_queries[name];
        promise.then((r) => {
            console.error("EOSNetworkConnexion.queryAccountData() CHECK POINT 3", [r]);
            setTimeout(() => {
                delete this._account_queries[r.account_name];
            });
        });
        
        return promise;
    }
    executeTransaction(contract:string, action:string, data:any): Promise<any> {
        console.error("EOSNetworkConnexion.executeTransaction() NOT IMPLEMENTED");
        return new Promise<any>(() => {});
    }
    getContractWrapper(account_name:string): Promise<SmartContract> {
        console.error("getContractWrapper() DEPRECATED! use getContract('"+account_name+"') instead");
        return new Promise<SmartContract>(() => this.getContract(account_name));
    }
    
    // loginTimer;
    async autologin():Promise<any> {
        await this.waitConnected;
        console.log("EOSNetworkConnexion.autologin()");
        console.log(ScatterJS.scatter.identity);
        if (!ScatterJS.scatter.identity) return null;
        this.setIdentity(ScatterJS.scatter.identity);
    }

    async login():Promise<any> {
        console.log("EOSNetworkConnexion.login()");
        this.feed.setLoading("login");
        
        return new Promise<any>(async (resolve, reject) => {
            console.log("EOSNetworkConnexion.login() await this.waitConnected;");
            await this.assertConnected("login");

            console.log("EOSNetworkConnexion.login()", this.scatter_network);
            let param = {accounts:[this.scatter_network]};
            ScatterJS.login(param).then(id => {
                console.log("EOSNetworkConnexion.login() ScatterJS.login(param) -> id:", id);
            // ScatterJS.login({accounts:[this.scatter_network]}).then(id => {
                this.feed.setLoading("login", false);
                if(!id)  {
                    console.error('no identity');
                    return reject("Could no login using ScatterJS.login using param: " + JSON.stringify(param));
                }
                this.setIdentity(id);
                console.log("EOSNetworkConnexion.login() --> ", this.account);
                resolve(this.account);
            }).catch(e => {
                // {"type":"identity_rejected","message":"User rejected the provision of an Identity","code":402,"isError":true}
                console.error("EOSNetworkConnexion.login() --> ", JSON.stringify(e));
                reject(e);
                this.feed.setLoading("login", false);
            });
        });
    }

    logout():Promise<any> {
        console.log("EOSNetworkConnexion.logout()");
        ScatterJS.forgetIdentity();
        this.waitLogged = new Promise((resolve) => {
            this.setLogged = resolve;
        });
        delete this.account;
        return new Promise<any>(() => {});
    }

    getTableRows(contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos): Promise<any> {
        console.debug("EOSNetworkConnexion.getTableRows(",contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos,")");
        
        console.assert(!!contract, "ERROR: contract is null");
        console.assert(!!scope, "ERROR: scope is null");
        console.assert(!!table, "ERROR: table is null");
        console.assert(!!tkey, "ERROR: tkey is null");
        console.assert(!!lowerb, "ERROR: lowerb is null");
        console.assert(!!upperb, "ERROR: upperb is null");
        console.assert(!!limit, "ERROR: limit is null");
        console.assert(!!ktype, "ERROR: ktype is null");
        console.assert(!!ipos, "ERROR: ipos is null"); 

        return new Promise<any>((resolve, reject) => {
            this.waitRPC.then(() => {
                let json = {
                    code: contract,
                    index_position: ipos,
                    json: true,
                    key_type: ktype,
                    limit: limit,
                    lower_bound: lowerb,
                    scope: scope,
                    table: table,
                    table_key: tkey,
                    upper_bound: upperb
                }
                
                this.rpc.get_table_rows(json).then(_data => {
                    console.debug("EOSNetworkConnexion.getTableRows(",contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos,") -> ", _data);
                    resolve(_data);
                }).catch(error => {
                    console.error(error);
                });

                
            }).catch((error) => {
                console.error(error);
                reject(error);
            });   
        });
    }

    isNative(thing: Asset | Token) {
        if (thing instanceof Asset) {
            return (<Asset>thing).token.symbol == this.symbol;
        }
        if (thing instanceof Token) {
            return (<Token>thing).symbol == this.symbol;
        }
        if (typeof thing == "string") {
            return this.isNative(new Asset((<string>thing)));
        }
        return false;
    }
}