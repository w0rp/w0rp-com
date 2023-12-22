---
title: The Site Has Been Converted to Hugo
date: 2023-12-22 15:50:00
tags: ["blog_update"]
---

As part of simplifying the job of maintaining the sites and apps I run, I have
converted w0rp.com to a static HTML site built with [Hugo](https://gohugo.io/).
The conversion simplifies the maintenance of my personal site in the following
ways:

* There's no Postgres database to maintain any more, just content.
* There's no need to maintain and update Python.
* There's no need to maintain Python packages and keep them up to date.
* nginx can be simplified to just serving the content.

The source for this site is available on GitHub
[here](https://github.com/w0rp/w0rp-com).

Because the site is entirely served as static content, there are no comment
forms any more. In order to not lose all of the comments that have been left in
the past, I have created a page archiving all of the comments people have made
so far, which [you can find here](/blog-comment-archive/).
