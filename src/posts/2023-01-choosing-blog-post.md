---
title: How choosing a blog engine can make you discover a javascript engine alternative
date: 2024-01-30T08:16:03.714Z
author: Tristan Parisot
tags:
  - Deno
  - Luma
  - Blog

---

When choosing a blog, many technologies are offered to you. I picked this one,
and I will tell you why. In this story, you will learn how I discovered Deno

<!-- more -->

## A little story about my blog search, and what my blog requirements ended up like.

I am not used to making blogs. I made a couple of them, on Medium. Since I like
to step outside of my comfort zone slowly, I was looking for a solution that
looked similar.

I found out about [Ghost](https://ghost.org/), it was a fit, and I already have
a cloud server I could deploy it to. Great idea. Then, I had to think about how
I would have to do backups of this. I was ready to make a cron, exporting a DB
to a S3 storage.

That's.. was not fun. I need simplicity. I need to not care about the SLA of my
cloud storage, and I do not wish to maintain a server up-to-date.

I ended up with a couple of requirements :

- It gives me the feeling of being in an unwinding place
- No infrastructure: static website generation, easy deployment in CDN/Github
  pages, or Netlify
- Little boilerplate: I am ready to learn new languages, but I want to maintain
  a blog, not a codebase.
- Neat look and feel: I want to relax my eyes while I write the blog
- Easy integration with plugins/styling
- Stack I master

## Neat candidates

On my shortlist, I had these tools to investigate.

### Astro

[Astro](https://astro.build/) is a nice website generator. It has a lot of
options, customizations, and strong server-side rendering options. Its main
selling point for me, was the easy
[integration](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
it has with CloudFlare. During the setup phase, your project is already
deployable. You do not need to have a public git repo.

It makes me discover
[Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
which I use for this blog.

What made me look elsewhere was the Astro syntax, too close to `React` for my
tastes. My blog is my personal space, I want it to look different than what I do
at my work! Honestly, the look& feel of Astro websites looks great, and I would
recommend it to HTML lovers

### Eleventy

[Eleventy](https://www.11ty.dev/) is similar to Astro: a static website
generator. I took it at first because of the native integration of markdown
files.

My mind then, subconsciously, tried to add a simple
[mermaid](https://github.com/mermaid-js/mermaid) graph to it. Sadly, to make
this work, plugins for it are using `pupeteer`, which I do not want to use.
Mermaid's competitor, [Pintora](https://pintorajs.vercel.app/docs/intro/) can be
rendered in SSR, but has no native integration with 11Ty.

So, I dropped my requirement about doing easy diagrams within the blog. If I
need them, probably, I will use `.dot` files, generated outside. I will cross
that bridge when I come to it.

Browsing Eleventy themes, I found this one:
[11r](https://github.com/reeseschultz/11r) you will see that this repository is
read-only, and by a small investigation, you will see that the author recommends
now using Lume, which I tested

### Lume

[Lume](https://lume.land/) is again a static site generator. It runs not on
[NodeJs](https://nodejs.org/en), but on [Deno](https://deno.com/). I will do
another blog post about Deno, but the tl-dr is that it feels like a better node,
from my devlopper perspective.

Lume has neat templates, alas, the best examples are not open-source licensed. I
forked https://github.com/lumeland/theme-simple-blog and adapted it to my needs.

Lume checks all the boxes: the static generation is neat, it is configurable,
and the look-and-feel is acceptable to my tastes
