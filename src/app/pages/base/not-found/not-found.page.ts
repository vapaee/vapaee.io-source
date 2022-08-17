import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';

@Component({
    selector: 'not-found-page',
    templateUrl: './not-found.page.html',
    styleUrls: ['./not-found.page.scss']
})
export class NotFoundPage implements OnInit {

    constructor(
        public app: AppService,
        public local: LocalStringsService
    ) {
    }

    ngOnInit() {
        console.log("NOT FOUND 404: ", window.location.href);
    }

}
