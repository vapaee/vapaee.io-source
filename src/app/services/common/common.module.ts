import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { LocalStringsService } from './local-strings.service';
import { DomService } from './dom.service';
import { BroadcastService } from './broadcast.service';
import { FacebookService } from './facebook.service';
import { AppService } from './app.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        AnalyticsService,
        LocalStringsService,
        DomService,
        BroadcastService,
        FacebookService,
        AppService
    ]
})

export class CommonServicesModule {}
