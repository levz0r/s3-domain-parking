import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {Angulartics2Module} from "angulartics2";
import * as config from "../../config.json";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app.routing";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        Angulartics2Module.forRoot({
            gst: {
                trackingIds: [config.trackingId],
                anonymizeIp: true
            }
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
