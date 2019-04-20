import { MediaMatcher } from "@angular/cdk/layout";
import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit, Renderer2 } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Angulartics2GoogleGlobalSiteTag } from "angulartics2/gst";
import * as config from "../../config.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private readonly isDesktop: boolean;

  public domainName: string;
  public innerHtml: string;
  public showRibbon: boolean;
  public fontSize: number;

  constructor(
    private readonly angulartics2GoogleGlobalSiteTag: Angulartics2GoogleGlobalSiteTag,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private readonly title: Title,
    private readonly media: MediaMatcher
  ) {
    if (config.trackingId) {
      this.angulartics2GoogleGlobalSiteTag.startTracking();
      this.initGoogleAnalyticsScript();
    }
    this.title.setTitle(config.domainName);
    this.isDesktop = this.media.matchMedia("(min-width: 768px)").matches;
  }

  ngOnInit(): void {
    this.domainName = config.domainName;
    this.innerHtml = config.innerHtml;
    this.showRibbon = config.showRibbon;
    this.fontSize = this.calculateFontSize();
  }

  private calculateFontSize(): number {
    let fontSize = this.isDesktop ? 6 : 4;
    if (this.domainName.length > 8) {
      fontSize *= 8 / this.domainName.length;
    }
    return fontSize;
  }

  private initGoogleAnalyticsScript(): void {
    let script = this._renderer2.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${
      config.trackingId
    }`;
    this._renderer2.appendChild(this._document.head, script);
    script = this._renderer2.createElement("script");
    script.type = `text/javascript`;
    script.text = `window.dataLayer = window.dataLayer || [];
                       function gtag(){dataLayer.push(arguments);}
                       gtag('js', new Date());
                       gtag('config', '${config.trackingId}');`;
    this._renderer2.appendChild(this._document.head, script);
  }
}
