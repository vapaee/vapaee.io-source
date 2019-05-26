import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ScatterService } from './scatter.service';
import { BGBoxService } from './bgbox.service';
import BigNumber from 'bignumber.js';
import { Profile } from './utils.service';

@Injectable()
export class CntService {

    public loginState: string;
    /*
    public loginState: string;
    - 'no-scatter': Scatter no detected
    - 'no-logged': Scatter detected but user is not logged
    - 'no-profiles': User logged but has no profiles in bg-box
    - 'no-selected': usr has several profiles but none selected 
    - 'no-registered': user has a selected profile but is not registered in C&T
    - 'profile-ok': user has selected a registered profile (has C&T inventories in BG-Box memory)
    */

    public logged: Profile;
    public selected: Profile;
    public current: Profile;
    public onLoggedProfileChange:Subject<Profile> = new Subject();
    public onCurrentProfileChange:Subject<Profile> = new Subject();
    public profile: Profile;
    public profiles: Profile[];
    public contract:string;
    cardsntokens:string = "cardsntokens";
    cntAuthorId: string;

    private setReady: Function;
    public waitReady: Promise<any> = new Promise((resolve) => {
        this.setReady = resolve;
    });
    constructor(
        private scatter: ScatterService,
        private bgbox: BGBoxService
        ) {

        this.logged = null;
        this.current = null;
        this.contract = this.cardsntokens;
        this.scatter.onLogggedStateChange.subscribe(this.updateLogState.bind(this));
        this.resetCurrentProfile();
        this.updateLogState();

        

        // get the author id for this Dapp --------------------------------
        var encodedName = this.bgbox.utils.encodeName(this.cardsntokens);
        var params = {
            lower_bound: encodedName.toString(), 
            upper_bound: encodedName.toString(), 
            limit: 1, 
            key_type: "i64",
            index_position: "2"
        }            
        this.bgbox.utils.getTable("apps", params).then(result => {
            if (result.rows.length > 0) {
                this.cntAuthorId = result.rows[0].id;
            }
        });
    }

    // --
    
    resetCurrentProfile() {
        this.profiles = [];
        this.current = {slugid:{str:"guest"}, account:this.contract};
        this.onCurrentProfileChange.next(this.profile);
    }

    login() {
        this.logout();
        this.scatter.login().then(() => {
            this.updateLogState();
        });
    }

    logout() {
        this.resetCurrentProfile();
        this.logged = null;
        this.onLoggedProfileChange.next(this.logged);        
    }

    fetchProfile(profile:string) {
        return this.bgbox.getAuthorBySlug(profile);
    }

    setCurrentProfile(profile:Profile) {
        this.current = profile;
        this.onCurrentProfileChange.next(this.current);
    }

    selectProfile(profile:Profile) {
        console.log("CntService.selectProfile(",[profile],")");
        if (this.selected.slugid.str != profile.slugid.str) {
            for (var i in this.profiles) {
                if (this.profiles[i].slugid.str == profile.slugid.str) {
                    this.selected = profile;
                }
            }
        }
        this.updateLogState();
    }

    /*
    selectProfile(profile:any) {
        console.log("-------- CntService.selectProfile(",[profile],") ---------");
        if (typeof profile  == "string") {
            for (var i in this.profiles) {
                if (this.profiles[i].slugid.str == profile) {
                    if (this.profile != this.profiles[i]) {
                        this.profile = this.profiles[i];
                        this.onProfileChange.next(this.profile);
                    }
                }
            }
        } else {
            if (this.profile != profile) {
                this.profile = profile;
                this.profiles.push(profile);
                this.onProfileChange.next(this.profile);
            }
        }
        this.updateLogState();       
    }
    */
    

    registerProfile() {
        console.log("CntService.registerProfile()");
        return this.bgbox.signUpProfileForApp(
            this.scatter.account.name,
            this.selected.id,
            this.cntAuthorId,
            this.bgbox.contract);
    }

    
    private updateRegisteredState() {
        console.log("CntService.updateRegisteredState()");
        return this.bgbox.getProfileContainers(this.selected.id, this.cntAuthorId).then(data => {
            var registered = false;
            for (var i in data.containers) {
                if (data.containers[i].asset_ref && data.containers[i].asset_ref.publisher == this.cntAuthorId) {
                    registered = true;
                    break;
                }
            }
            if (registered) {
                this.logged = this.selected;
                this.onLoggedProfileChange.next(this.logged);
                //this.onProfileChange.next(this.profile);
            }
            return this.logged;
        });
    }
    

    private updateLogState() {
        console.log("CntService.updateLogState()");
        this.loginState = "no-scatter";
        this.scatter.waitConnected.then(() => {
            this.loginState = "no-logged";
            // console.log("this.scatter", [this.scatter]);
            if (this.scatter.logged) {
                this.loginState = "no-profiles";
                if (this.profiles.length == 0) {
                    this.bgbox.getAuthorsFor(this.scatter.account.name).then(data => {
                        if (data.profiles.length > 0) {
                            this.loginState = "no-selected";
                            this.profiles = [];
                            for (var i in data.authors) {
                                this.profiles.push(data.authors[i]);
                            }
                        }
                        if (this.profiles.length == 1 && this.profile != this.profiles[0]) {
                            this.selected = this.profiles[0];
                            this.loginState = "no-registered";
                        }

                        if (this.loginState == "no-registered") {
                            this.updateRegisteredState().then(() => {
                                if (this.logged) this.loginState = "profile-ok";
                            });
                        }
                    });
                } else {
                    if (!this.selected) {
                        this.loginState = "no-selected";
                    } else {
                        this.loginState = "no-registered";
                        this.updateRegisteredState().then(() => {
                            if (this.logged) this.loginState = "profile-ok";
                        });
                    }
                }
            }
        })
    }

}
