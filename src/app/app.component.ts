import {DOCUMENT} from "@angular/common";
import {Component, Inject, OnInit, Renderer2} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {Angulartics2GoogleGlobalSiteTag} from "angulartics2/gst";
import * as config from "../../config.json";

@Component({selector: "app-root", templateUrl: "./app.component.html", styleUrls: ["./app.component.scss"]})
export class AppComponent implements OnInit {
    public domainName: string;
    public innerHtml: string;
    public showRibbon: boolean;

    constructor(private readonly angulartics2GoogleGlobalSiteTag : Angulartics2GoogleGlobalSiteTag, private _renderer2 : Renderer2, @Inject(DOCUMENT)private _document : Document, private readonly title : Title) {
        if (config.trackingId) {
            this.angulartics2GoogleGlobalSiteTag.startTracking();
            this.initGoogleAnalyticsScript();
        }
        this.title.setTitle(config.domainName);
    }

    ngOnInit(): void {
        this.domainName = config.domainName;
        this.innerHtml = config.innerHtml;
        this.showRibbon = config.showRibbon;
    }

    private initGoogleAnalyticsScript(): void {
        let script = this._renderer2.createElement("script");
        script.type = `text/javascript`;
        script.text = `ga('create', '${config.trackingId}', 'auto');`;
        this._renderer2.appendChild(this._document.head, script);
    }
}
