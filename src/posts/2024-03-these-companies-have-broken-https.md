---
title: These companies have broken HTTPS. What are your options?
date: 2024-03-18T19:24:11.707Z
author: Tristan Parisot
tags:
  - Web
  - HTTPS
  - CDN
---

You're on vacation. You see this unsecured "Free Wifi" network.
You click on it because you have no other alternatives.

10 years ago, HTTPS was not common. However, "captive portals" started to boom.
They intercept your web pages, and replace them with a "portal" so you can enter
your hotel room number and your name.

Some other portals injected malicious code such as
[ads](https://arstechnica.com/information-technology/2015/08/atts-free-wi-fi-hotspot-injects-extra-ads-on-non-att-websites/)
but you can also inject [crypto miners](https://github.com/arnaucube/coffeeMiner)

Today, such attacks on WiFi hotspots are limited thanks to HTTPs: you cannot alter the web
pages between the browser and the server providing the web pages.

However, today, the server distributing the web pages is not likely owned by
the website owner. Most likely, for your website to scale, you have uploaded
it somewhere such as in a _Content Delivery Network_.

<!-- more -->

## What is great with HTTPS

Long tine ago, if you wanted to connect to a server, for example let's say, battle.net,
you'd reach a single server in the garage or the basement of the company holding it.

HTTPS provides the following properties:

- Data-tempering prevention
- Data-inspection prevention
- Trust of the resource, via the certificate

This protection is great, but cease behind a CDN.

## What happens when you view a web page?

When a user targets a website ( I will take a famous newspaper website as an example),
their browser downloads the content from a server. A single server will not be able
to handle all the traffic for all the internet. This is why content is distributed in
CDNs. The CDN has servers all around, and they act as cache while targeting your servers.

<center>
<div class="mermaid">
sequenceDiagram
  Browser->>user dns: where is www.theguardian.com ?
  user dns->>cdn dns: where is www.theguardian.com ?
  cdn dns->>cdn dns: finds server close to user
  cdn dns-->>user dns: here is: 151.101.129.111
  user dns-->>Browser: here is: 151.101.129.111 (dualstack.guardian.map.fastly.net)
  note right of user dns: fastly is distributing the content<br/> owned by the guardian
  note right of 151.101.129.111: CDN
  Browser->>151.101.129.111: Client hello
  151.101.129.111-->151.101.129.111: read certificate & private keys for www.theguardian.com
  151.101.129.111-->>Browser: certificate
  Browser->>Browser: check certificate against www.theguardian.com
  Browser->>151.101.129.111: [https] GET HTTP https://www.theguardian.com/
  151.101.129.111->>151.101.129.111: check in cache
  alt has not in cache  
    151.101.129.111->>target server:download
  end
  151.101.129.111->>Browser:content encrypted with certificate 
</div>
</center>

## So what's wrong with HTTPs

Before, the HTTPs channel was from the end user.. and .. the physical server, located
in your own company garage/basements. But that was before the internet with a need for
scale. Now, content is distributed from afar.

Nothing prevents a CDN from altering the content before servicing it to end users.
Would they do that? Maybe not on purpose. But they can be hacked, or be victims of supply chain attacks.

While I trust them to not fall easily into such schemes, I would not trust them
blindly and risk my life or my company's life.
As such, even if you use end-to-end encryption, you still risk data to leak, because
your CDN could end up corrupted, and inject malicious script in your web front end.

On top of that, HTTPs prevent eavesdropping in the data stream, making it impossible
for companies to check if their employees aren't downloading viruses through it. If you
need to inspect HTTPs stream, you need to inject a CDN, and you render your users vulnerable to file alterations.

## Could we prevent such problems by making the browser cryptographically check for alterations?

A long time ago, when HTTPS was not common, and when people started to send emails,
the same issue occurred: how do you make sure that an attacker has not replaced your email content?
If you need to pay a small fee to allow a [foreign prince](https://en.wikipedia.org/wiki/Advance-fee_scam)
to give you a lot of money, you want to make sure that the bank account number has not been changed by a scammer.

Once [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) has been smuggled out
of the USA by using a legal loophole, it started to be used to encrypt or sign some
files. On small closed circles, it also have been used to sign emails.

Some people tried to apply this to webpages. You can for example find browser
[extensions](https://github.com/tasn/webext-signed-pages)

But like emails never took off, due to high complexity versus low perceived risk.
How do you make sure to obtain the correct public key of your peers? On closed
circles, you can use separate channels (such as giving USB keys, or active directory..) to distribute it.

On bigger circles, You need a web of trust.

## The web of trust and domain names

You've learned about [chat GPT](https://www.mozilla.org/en-US/), but you finally decide
to try it. You do not know them personally. How the website is going to prove its identity?
Using a certificate chain.

Today, browsers come with pre-installed official root certificate authorities.
It means you implicitly trust entities and allow them to create identities for any
website. For example, french people don't know about [Dhimyotis](https://www.dhimyotis.com/),
but their browsers do. And Dhimyotis authority is used whenever you reach a government website.
If they want to generate a certificate for any other website, they technically can!
They won't, due to regulations.

If you want to add HTTPs to your website, you need to obtain a certificate, and you need
to make sure your certificate is signed by a certificate.. that ends up signed by one
of your installed certificates. This involves a process, which can be
[impacted by politics](https://www.eff.org/fr/deeplinks/2022/03/you-should-not-trust-russias-new-trusted-root-ca)

Long time ago, this process involved doing a verification of your entity, for example
sending you a physical mail, doing phone calls. It takes a while, costs money, but you get a 10 years certificate!

These days, you can obtain a certificate easily if you control the domain name.
You can do it with [Let's encrypt](https://doc.traefik.io/traefik/user-guides/docker-compose/acme-dns/),
or you can even let your CDN create the certificate for you,
usually [for free](https://www.cloudflare.com/application-services/products/ssl/).

As long as you control a domain name, authorities will accept to give you a certificate, which is a proof of authenticity.

> Controlling a domain name means you have control over the certificates and the authenticity of the content.
> If you do not want your CDN to own the authenticity of your content, you need a separate domain name

## Okay, I have two domain names. What now?

You've registered `yourwebsite.org` and `cdn-yourwebsite.org` ? Good!
Now:

- how are you going to make your users reach out `yourwebsite` but its content comes from the cdn?
- how are you going to check for the integrity of the cdn content?

### Let's keep the small HTML pages and distribute everything else on the CDN

If all your HTML pages is on `yourwebsite.org` and the rest is on the CDN, this may work.
Make sure your HTML pages have a [strict CSP](https://web.dev/articles/strict-csp) in place, with HASHES

> If you use nonces in a static content, someone can grab them, breaking your security really hard.

#### Shipping a react app with strict CSP

Example incoming

### Using Signed HTTP exchanges

[Signed exchanges](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/signed-exchange)
are a technology from Google.

It allows to sign that content is associated from a URL. This way, the browser
can display `https://www.mywebsite.com` even if in reality, the content has been
obtained from any other URL, as long as the content is signed.

This technology is not yet widely used:

- It pushes you closer to the [controversial](https://www.theverge.com/23711172/google-amp-accelerated-mobile-pages-search-publishers-lawsuit) AMP technology
- As of March 2024, it obliges you to obtain a DigiCert certificate

## Tl-Dr:

If you use Cloudflare, Facebook-CDN, Fastly, Or Amazon Cloudfront, you're
potentially giving someone cryptographic ownership of your website.
You can take back ownership, but this is a difficult step.
