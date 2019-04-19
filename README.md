# S3 Domain Parking

Configurable lightweight domain parking page with Google Analytics support.
![](https://i.ibb.co/k4vT5HM/screencapture-localhost-4201-2019-04-19-21-14-57-macbookgold-front.png)
This project creates an S3 bucket that is configured to host a static website with CORS enabled. All you have to do is to configure the project and create a CNAME record in your domain.

## Prerequisites

1.  [AWS free tier account](https://aws.amazon.com/free/);
2.  [Programmatic access to AWS account](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html);
3.  Access to Domain management (Namecheap, GoDaddy, etc.);
4.  [Google Analytics](https://analytics.google.com) account (optional).

## Limitations

Because of the way S3 static website hosting works, it is not possible to create a CNAME record of the top level of your domain. Therefore, you can park `(subdomain).domain.com` (e.g `www.domain.com`). Having said that, some DNS providers (Namecheap) allow redirecting the top level domain to a subdomain.
_See question [here](https://serverfault.com/questions/410727/point-s3-bucket-to-top-level-domain)_.

## Configuration

Before your parking page is ready, please make sure to configure it for your needs. All configuration lays inside `config.json`:

```
{
    "trackingId": "",
    "domainName": "",
    "innerHtml": "Coming soon...",
    "accessKeyId": "",
    "secretAccessKey": "",
    "awsRegion": "us-east-1",
    "showRibbon": true|false
}
```

_All fields are mandatory unless stated otherwise._

* `trackingId`: Google Analytics Tracking ID (see below how to obtain). This is property is optional - if not defined, tracking will be deactivated.
* `domainName`: The domain name which will be shown on your parking page.
* `innerHtml`: The HTML/text which will appear under the domain name.
* `accessKeyId`: AWS Access Key ID (see below how to obtain).
* `secretAccessKey`: AWS Secret Key (see below how to obtain).
* `awsRegion`: AWS region. Defaults to _us-east-1_ and doesn't really matter for our use-case, still required by _aws-sdk_.
* `showRibbon`: Display the ribbon at the top of the page (thanks to [fork-me-on-github-retina-ribbons](https://github.com/aral/fork-me-on-github-retina-ribbons)!).

### Obtaining Google Analytics Tracking ID

![](https://i.ibb.co/8PRTJ87/analytics-property.png)

[Instructions](https://support.google.com/analytics/answer/7476135?hl=en#choosetracking)

## Deploy to S3

To deploy your parking page, open terminal and run:

1.  `npm install`
2.  `npm run deploy`
3.  When the process completes, create a CNAME record, as shown on the screen.

You're all set! Visit your domain to verify the landing page works. Please note that it might take some time for some DNS service providers to update your domain records.
