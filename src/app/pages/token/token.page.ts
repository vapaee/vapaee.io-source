import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { TokenDEX, TokenData } from 'projects/vapaee/dex/src/lib/token-dex.class';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'token-page',
    templateUrl: './token.page.html',
    styleUrls: ['./token.page.scss', '../common.page.scss']
})
export class TokenPage implements OnInit, OnDestroy, AfterViewInit {

    token: TokenDEX;

    _safe_url_cache = {};
    
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private http: HttpClient
    ) {
        var symbol = this.route.snapshot.paramMap.get('symbol');
        this.dex.waitTokensLoaded.then(_ => {
            this.token = this.dex.getTokenNow(symbol.toUpperCase());
            console.log("----> token: ", this.token);
            this.token.brief = "A platform where you can create themed albums and trading cards to collect and play making money in the process.";
            this.token.banner = "assets/img/cards-and-tokens-1200x400.jpeg";
            this.token.data = [];
            
            this.token.data.push({
                id:5,
                symbol: this.token.symbol,
                category: "image",
                text: "Cards & Tokens banner image",
                link: "assets/img/cards-and-tokens-1200x400.jpeg"
            });
            
            this.token.data.push({
                id:1,
                symbol: this.token.symbol,
                category: "youtube",
                text: "Promo video",
                link: "https://youtu.be/YSVJgKsSobA"
            });

            this.token.data.push({
                id:2,
                symbol: this.token.symbol,
                category: "twitter",
                text: "Membership cards",
                link: "https://twitter.com/TokensCards/status/1109668817175748608"
            });

            this.token.data.push({
                id:3,
                symbol: this.token.symbol,
                category: "youtube",
                text: "Demo video",
                link: "https://www.youtube.com/watch?v=jhL1KyifGEs&list=PLIv5p7BTy5wxqwqs0fGyjtOahoO3YWX0x&index=1"
            });

            this.token.data.push({
                id:4,
                symbol: this.token.symbol,
                category: "twitter",
                text: "The CNT token airdrop",
                link: "https://twitter.com/TokensCards/status/1105088865994452993"
            });            

            for (let i in this.token.data) {
                let info = this.token.data[i];
                if (info.category == "twitter") {
                    this.fetchTwitter(info);
                }
            }           
            
        });
    }

    fetchTwitter(info: TokenData) {
        var url = "https://publish.twitter.com/oembed?&url="+info.link;
        this.http.jsonp<any>(url, 'callback').toPromise().then(result => {
            info.html = result.html;
            this.renderTweets(1000);
            this.renderTweets(2000);
            this.renderTweets(5000);
            this.renderTweets(10000);
        });
    }


    tradeToken(token:TokenDEX) {
        this.app.navigate('/exchange/trade/'+token.symbol.toLowerCase()+'.tlos');
    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }

    renderTweets(delay) {
        setTimeout(_ => {
            (function(d,s,id){
                var js: any,
                    fjs=d.getElementsByTagName(s)[0],
                    p='https';
                if(!d.getElementById(id)){
                    js=d.createElement(s);
                    js.id=id;
                    js.src=p+"://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js,fjs);
                }
            })
            (document,"script","twitter-wjs");
        }, delay);
    }

    ngAfterViewInit () {
        this.renderTweets(1000);
    }

    tradeMarket(scope:string) {
        this.app.navigate('/exchange/trade/'+scope);
    }

    getEmbedLink(info:TokenData) {
        this._safe_url_cache = this._safe_url_cache || {};
        var info_id = "id-"+info.id;
        if (this._safe_url_cache[info_id]) {
            return this._safe_url_cache[info_id];
        }
        if(info.category == "youtube") {
            var finalsrc:SafeResourceUrl = null;
            var link = "https://www.youtube.com/embed/";
            var video_id = null;
            // ----- https://youtu.be/YSVJgKsSobA ------
            var result = info.link.match(/https:\/\/youtu.be\/(.+)/);
            if (result) {
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                return finalsrc;
            }
            // ----- https://www.youtube.com/watch?v=jhL1KyifGEs ------
            var result = info.link.match(/\?v=([^&]+)$/);
            if (result) {
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                return finalsrc;
            }
            // ----- https://www.youtube.com/watch?v=jhL1KyifGEs&list=PLIv5p7BTy5wxqwqs0fGyjtOahoO3YWX0x&index=1 ------
            var result = info.link.match(/\?v=([^&]+)&.*/);
            if (result) {
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                return finalsrc;
            }
        }
    }
}
