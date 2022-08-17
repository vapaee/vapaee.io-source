import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX, TokenDEX } from '@vapaee/dex';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface DivStyle {
    top: number;
    left: number;
    width: number;
    height: number;
}


@Component({
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss', '../../common.page.scss']
})
export class LandingHomePage implements OnInit, OnDestroy {
   
    timer: NodeJS.Timer = setTimeout(() => { }, 0);
    percent: number = 0;
    section: string = "";
    sub_section: string = "";
    initial_position:DivStyle = <DivStyle>{};
    deploy: string = "";
    deploy_dex: string = "";

    constructor(
        public app: AppService,
        public route: ActivatedRoute,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {

        this.app.onGlobalEvent.subscribe(env => {
            if (env == "goto-home") {
                this.gotoHome();
            }
        });
    }

    ngOnInit() {

        this.route.url.subscribe(url => {
            
            let path = url[0].path;
            if (path != 'home') {
                setTimeout(() => {
                    this.deploySection(<HTMLDivElement>document.getElementById(path), path);
                }, 100);
            } else {
                this.displayHome();
            }
        });

        
    } 

    ngOnDestroy() {
        clearInterval(this.timer);
    }

    setPercent(percent: number) {
        this.percent = percent;
    }

    gotoHome() {
        console.log("LandingHomePage.gotoHome()");
        this.app.go('/landing/home');

        this.displayHome();
    }

    displayHome() {
        console.log("LandingHomePage.displayHome()");

        let div = <HTMLDivElement>document.getElementById(this.section);
        div.style.top = this.initial_position.top + 'px';
        div.style.left = this.initial_position.left + 'px';
        div.style.width = this.initial_position.width + 'px';
        div.style.height = this.initial_position.height + 'px';

        this.section = "home";
        this.deploy = this.section;
        
        
        this.cleanSubSections();

        console.error(
            "displayHome()",
            "init: ", this.initial_position.top, this.initial_position.left,
            "div.style: ", div.style.top, div.style.left
        );


        setTimeout(() => {
            console.log("setTimeout()");
            div.classList.remove("floating");
            
            div.style.top = "unset";
            div.style.left = "unset";
            div.style.width = 'auto';
            div.style.height = 'auto';

            this.showHomeObjects();
        }, 800);
    }

    gotoSection(div_btn: HTMLDivElement, section: string) {
        console.log("LandingHomePage.gotoSection()", section);
        if (section == this.section) {
            this.app.go('/landing/home');
            this.displayHome();
        } else {
            this.app.go('/landing/'+section);
            this.deploySection(div_btn, section);    
        }
    }

    hideHomeObjects() {
        let div_btn = <HTMLDivElement>document.getElementById(this.section);
        // first we need to hide all the other objects
        // set the class hide in the div.etapa-btn
        let divs = document.getElementsByClassName("etapa-btn");
        for (let i = 0; i < divs.length; i++) {
            let div = divs[i];
            if (div != div_btn) {
                div.classList.add("hide");
            }
        }

        // find the element with class 'progress-title' and add the class 'hide'
        let div_title = document.getElementsByClassName("progress-title")[0];
        div_title.classList.add("hide");

        // find the element with class 'progress' and add the class 'hide'
        let div_progress = document.getElementsByClassName("progress")[0];
        div_progress.classList.add("hide");

        // find the element with class 'vapaee-logo' and add the class 'hide'
        let div_logo = document.getElementsByClassName("vapaee-logo")[0];
        div_logo.classList.add("hide");
    }

    showHomeObjects() {
        let div_btn = <HTMLDivElement>document.getElementById(this.section);
        // first we need to hide all the other objects
        // set the class hide in the div.etapa-btn
        let divs = document.getElementsByClassName("etapa-btn");
        for (let i = 0; i < divs.length; i++) {
            let div = divs[i];
            if (div != div_btn) {
                div.classList.remove("hide");
            }
        }

        // find the element with class 'progress-title' and remove the class 'hide'
        let div_title = document.getElementsByClassName("progress-title")[0];
        div_title.classList.remove("hide");

        // find the element with class 'progress' and remove the class 'hide'
        let div_progress = document.getElementsByClassName("progress")[0];
        div_progress.classList.remove("hide");

        // find the element with class 'vapaee-logo' and remove the class 'hide'
        let div_logo = document.getElementsByClassName("vapaee-logo")[0];
        div_logo.classList.remove("hide");
    }

    deploySection(div_btn: HTMLDivElement, section: string) {
        console.log("LandingHomePage.deploySection()");
        console.log(section, [div_btn]);

        this.section = section;

        this.hideHomeObjects();

        // store in temporal variables the current div absolute position
        let div_btn_pos = div_btn.getBoundingClientRect();
        console.log("div_btn_pos", div_btn_pos);

        // add the class 'floating' to the div
        div_btn.classList.add('floating');

        // find the first parent div with the position absolute or relative
        let parent = div_btn.parentElement;
        while (parent && parent.tagName != 'BODY') {

            // get the position value of the parent
            let position = window.getComputedStyle(parent).getPropertyValue('position');

            // if the parent has the position absolute or relative, break
            if (position == 'absolute' || position == 'relative') {
                break;
            }           
            
            parent = parent.parentElement;
        }

        if (!parent) return;

        let parent_pos = parent.getBoundingClientRect();
        console.log("parent_pos", parent_pos);
        console.log("parent", parent);

        // set the div with an absolute position such thet it will be the same stored in div_btn_pos
        this.initial_position.top = (div_btn_pos.top-parent_pos.top);
        this.initial_position.left = (div_btn_pos.left-parent_pos.left);
        this.initial_position.width = div_btn_pos.width;
        this.initial_position.height = div_btn_pos.height;

        div_btn.style.top = this.initial_position.top + 'px';
        div_btn.style.left = this.initial_position.left + 'px';
        div_btn.style.width = this.initial_position.width + 'px';
        div_btn.style.height = this.initial_position.height + 'px';

        console.error(
            "deploySection()",
            "init: ", this.initial_position.top, this.initial_position.left,
            "div_btn: ", div_btn_pos.top, div_btn_pos.left,
            "parent: ", parent_pos.top, parent_pos.left
        );

        this.cleanSubSections();

        // after 0.5 seconds move the div to the top left corner with good margins as it were a title
        setTimeout(() => {
            console.log("setTimeout()");

            // find any div with class 'container
            let container = document.querySelector('.container');
            if (!container) return;
            let container_pos = container.getBoundingClientRect();

            div_btn.style.top = '100px';
            div_btn.style.left = container_pos.left + 'px';

            this.deploy = this.section;
            
            setTimeout(() => {
                if (this.section == "dex") this.gotoSubSection("book");
                if (this.section == "kw") this.gotoSubSection("home");
                if (this.section == "wd") this.gotoSubSection("funds");
            }, 800);

        }, 500);

        

    }

    cleanSubSections() {
        this.sub_section = "";
    }

    // DEX -------------------------------
    gotoSubSection(name: string) {
        this.sub_section = name;        
    }

        
    /*

    get tokens(): TokenDEX[] {
        return this.dex.tokens;
    }

    tradeToken(token:TokenDEX) {
        this.app.navigate('/exchange/trade/'+token.table);
    }

    tokenPage(token:TokenDEX) {
        this.app.navigate('/exchange/token/'+token.symbol.toLowerCase());
    }    

    gotoAccount(name:string) {
        this.app.navigate('/exchange/account/' + name);
    }

    gotoTable(table:string) {
        this.app.navigate('/exchange/trade/' + table);
    }
    */
}
