import { Subject } from 'rxjs';
import { Feedback } from 'projects/vapaee/feedback/src/lib/feedback.service';
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





export class EOSNetworkConnexion implements VapaeeScatterConnexion { 
    error: string;
    symbol: string;
    feed: Feedback;
    onEndpointChange:Subject<EndpointState> = new Subject<EndpointState>();
    onLogggedStateChange:Subject<boolean> = new Subject<boolean>();
    _account: Account;
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
    private setEosjs: Function;
    public waitEosjs: Promise<any> = new Promise((resolve) => {
        this.setEosjs = resolve;
    });
    private setEosconf: Function;
    public waitEosconf: Promise<any> = new Promise((resolve) => {
        this.setEosconf = resolve;
    });
    

    utils:ScatterUtils;
    account: Account
    def_account: Account

    networks: string[];

    username: string;
    authorization: {authorization:string[]};
    

    // private _network: Network;
    public eosconf: Eosconf;
    public eos: EOS;
    public rpc: JsonRpc;
    public _connected: boolean;
    public scatter_network: ScatterJS.Network;

    constructor(
        public scatter: VapaeeScatterInterface,
        public slug: string,
        public http: HttpClient
    ) {
        this.feed = new Feedback();
        ScatterJS.plugins( new ScatterEOS() );
        this.symbol = this.scatter.getNetwork(slug).symbol;        
    }

    get logged() {
        return !!this.account;
    }   

    get connected() {
        return this._connected;
    }

    getContract(account: string): SmartContract {
        return new SmartContract(account, this);
    }

    async assertContext() {
        return new Promise(r => {
            if (ScatterJS.scatter.network && ScatterJS.scatter.network.chainId != this.scatter.getNetwork(this.slug).chainId) {
                console.log("ScatterJS changning context to " + this.scatter.getNetwork(this.slug).slug );
                this.scatter.resetIdentity();
                this.onLogggedStateChange.next(true);
                setTimeout(() => r(), 1500);
            } else {
                r();
            }    
        });
    }    
    
    async connect(appname:string) {
        console.debug("EOSNetworkConnexion.connect("+appname+")");
        console.log(this);

        this.feed.setLoading("connecting");

        return new Promise(async (resolve, reject) => {
            await this.waitEosconf;

            this.scatter_network = ScatterJS.Network.fromJson(this.eosconf);
            this.rpc = new JsonRpc(this.scatter_network.fullhost());        
    
            console.log("this.scatter_network",this.scatter_network);
            console.log("rpc", this.rpc);
            console.log("ScatterJS",ScatterJS);
    
            await this.delay(1000);
            const connectionOptions = {initTimeout:1800, network:this.scatter_network};

            console.log("ScatterJS.connect("+appname+", connectionOptions)...");

            setTimeout(async () => {
                // assert ScatterJS has the same context as we have in this Connexion
                await this.assertContext();

                // try to connect
                ScatterJS.connect(appname, connectionOptions).then(async connected => {
                    this._connected = connected;
                    if(!this.connected) {
                        let error = "ScatterJS.connect("+appname+",{this.scatter_network}) -> connected: false ";
                        console.error('no scatter :(');
                        reject(error);
                        this.feed.setLoading("connecting", false);
                        return;
                    }
                
                    this.eos = <EOS>ScatterJS.eos(this.scatter_network, Api, {rpc:this.rpc});            
                    console.log("ScatterJS.eos()", this.eos);
                    console.log("ScatterJS", ScatterJS);
                    await this.delay(2000);
                    this.setEosjs();
                    resolve();
                    this.feed.setLoading("connecting", false);
                }).catch(e => {
                    console.error("ERROR: ScatterJS.connect("+appname+", connectionOptions) failed", e);
                    reject(e);
                    this.feed.setLoading("connecting", false);
                })
    
            }, 2500)
    
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
    resetIdentity() {
        console.log("EOSNetworkConnexion.resetIdentity()");
        delete this.account;
    }
    updateAccountData() {
        console.log("EOSNetworkConnexion.updateAccountData()");
        console.error("NOT IMPLEMENTED");

        this.queryAccountData(this.account.name).then(account => {
            this.account.data = account;
            this.onLogggedStateChange.next(true);
        }).catch(_ => {
            this.account.data = this.def_account.data;
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
        console.error("initScatter() NOT IMPLEMENTED");
    };
    retryConnectingApp() {
        console.error("retryConnectingApp() NOT IMPLEMENTED");
    };
    async connectApp(appTitle:string = "") {
        console.log("EOSNetworkConnexion.connectApp("+appTitle+")");
        this.feed.setLoading("connect-app");

        await this.connect(appTitle).catch(e => {
            console.error("ERROR: connect()", e);
        });

        await this.login().catch(e => {
            console.error("ERROR: login()", e);
        });

        this.feed.setLoading("connect-app", false);
        console.log("--------- fin -------------");
    }
    

    // AccountData and Balances ---------------------------------
    calculateTotalBalance(account:Account): Asset {
        console.error("NOT IMPLEMENTED");
        return null;
    }
    calculateTotalStaked(account:Account): Asset {
        console.error("NOT IMPLEMENTED");
        return null;
    }
    calculateResourceLimit(limit:Limit): Limit {
        console.error("NOT IMPLEMENTED");
        return limit;
    }
    queryAccountData(name:string): Promise<AccountData> {
        console.error("NOT IMPLEMENTED");
        return new Promise<any>(() => {});
    }
    executeTransaction(contract:string, action:string, data:any): Promise<any> {
        console.error("NOT IMPLEMENTED");
        return new Promise<any>(() => {});
    }
    getContractWrapper(account_name:string): Promise<SmartContract> {
        console.error("getContractWrapper() DEPRECATED! use getContract('"+account_name+"') instead");
        return new Promise<any>(() => this.getContract(account_name));
    }
    
    // loginTimer;
    login():Promise<any> {
        this.feed.setLoading("login");
        return new Promise<any>(async (resolve, reject) => {
            await this.waitEosjs;
            console.log("EOSNetworkConnexion.login()", this.scatter_network);
            var param = {accounts:[this.scatter_network]};
            ScatterJS.login(param).then(id => {
            // ScatterJS.login({accounts:[this.scatter_network]}).then(id => {
                this.feed.setLoading("login", false);
                if(!id)  {
                    console.error('no identity');
                    return reject("Could no login using ScatterJS.login using param: " + JSON.stringify(param));
                }
                this.account = ScatterJS.account('eos');
                console.log("EOSNetworkConnexion.login() --> ", this.account);
                this.setLogged();
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
        console.error("NOT IMPLEMENTED");
        return null;
    }

    isNative(thing: Asset | Token): boolean {
        console.error("NOT IMPLEMENTED");
        return false;
    }
}