import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { TokenDEX, TokenData } from 'projects/vapaee/dex/src/lib/token-dex.class';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

declare const twttr: any;


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
        this.dex.waitTokenData.then(_ => {
            this.token = this.dex.getTokenNow(symbol.toUpperCase());

            if (this.token.brief == "") {
                this.token.brief = null;
            }

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
            this.renderTweets(15000);
            this.renderTweets(20000);
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
            console.log("renderTweets("+delay+")", typeof twttr);
            twttr?twttr.widgets.load():null;
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
