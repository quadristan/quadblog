---
title: Stealing some flags in google cloud and learning from it
date: 2024-01-31T16:48:25.731Z
author: Tristan Parisot
tags:
  - CTF
  - GCP 
  - Infrastructure
  - SecAtScale
---

Today, web applications with a need for scale use a dynamic infrastructure to
support your application needs. The cloud has been brought to life.

I attended a Capture-the-flag challenge organized by
[Secatscale](https://www.secatscale.com/) with Google, and I want to share you
my learnings from this experience.

<!-- more -->

Famous cloud platforms are [Amazon Web Services](https://aws.amazon.com/),
[Azure](https://azure.microsoft.com/en-us), and also
[Google Cloud Platform](https://cloud.google.com/)

Cloud infrastructures are safe. Are they? Well, they are as safe as the weak
link between their configuration, and the platform itself.

## How to ace the CTF

### Know your assets

Your application is deployed, and use resources or Assets The most important
assets in this CTF exercise:

- Cloud storage (AWS S3 equivalent) where files are stored. Files usage can vary
  such as application data, or data allowing for reconfiguring the cloud
  infrastructure
- Cloud Run (AWS Fargate equivalent) is a binding between an endpoint (IP
  address) and an application, such as a docker image
- IAM policies: where we can manage individual and global permissions
- Logs Explorer: A Kibana-like logs stream

### Know the situation

Remember the last time you opened a complex app for the first time, and got
overwhelmed by thousands of menus? My last time was with Blender.

Google knows their platform console is complex, and made a small video giving
you pointers about what to look at first. Check out their
[DIALC](https://www.youtube.com/watch?v=2KjC-oEnIiw)

### Start your social engineering first!

CTF games are fun, and help you learn. They, however, cost. Ask yourself, who is
going to pay for that, and how? If you, the participant, didn't pay much, it
means that the event was made with sponsorship in mind.

It is fair to assume someone is trying to sell something. Ask yourself: who and
what. By knowing the what, you can anticipate the challenges before you read
them.

## Problems raised

### Ransomware keys

I never understood why ransomware creators are encrypting the files. Why not,
replace them with random data? What are you going to do if they can't decrypt
your files anyway? Sue them?

Anyway, in this CTF, we had ethical hackers encrypting our cloud storage files.
To trigger an encryption process in the cloud, you need the key somewhere.
Either as a file or as a credential. Simply check the cloud storage/s3 or any
key/secret manager.

Lesson for ethical hackers: do not encrypt all the files with the same symmetric
key. Make sure the symmetric key is not stored unencrypted on the disk. More
detail
[here](./2024-02-my-crypto-guidelines-for-eng.md#encrypting-arbitrary-data-and-protecting-its-~~integrity~~)

### Permission set on the asset for someone not in the IAM (Identity Access Management)

In GCP, you can attach specific permissions to an asset (ex: cloud storage).
Make sure to check the permission at the asset level first, then in the IAM.

### Permanent volatile authentication: Service account keys

Service Account keys are similar to
[JWT](https://en.wikipedia.org/wiki/JSON_Web_Token): they grant access to
resources. Except, contrary to JWT, these keys do not expire.

In this CTF, attackers get the Service Account Keys from various places, from
the cloud storage, or read it directly from the docker images. The lesson here
is to remember to protect your keys like you should not write passwords on
post-its.

### LLM injections

With the boom of LLM (ChatGPT, etc), companies are using it and making it learn
from a private data set. The LLM model can by mistake absorb information, and
later on, give it away to the users.

To counter that, companies can try to give it rules. However, they can always
get countered by clever tricks.

Other games in this style:

- [Gandalf](https://gandalf.lakera.ai/)
- [Double speak](https://doublespeak.chat/#/)
- [Giskard.ai](https://red.giskard.ai/)

What's more fun? Once a LLM model has learned something, it is costy to make it
forget. The usual way is to make it learn again everything from scratch.
Hopefully, there will be more about
[machine unlearning](https://blog.research.google/2023/06/announcing-first-machine-unlearning.html)
in 2024.

### Supply chain attacks

In this CTF, attackers were using old images of docker with vulnerabilities.
While this is not a real supply chain attack, it's still exploiting a
vulnerability in the asset repository. Similar to the supply chain, indeed.

SecAtScale and Google were kind enough to give us a list of interesting tools to
scan dependencies quality:

- [Deps.dev](https://deps.dev/)
- [Sos.dev](https://sos.dev/)

## Conclusion

CTFs are fun. Let's have fun, let's learn, and let's make the world a safer
place!
