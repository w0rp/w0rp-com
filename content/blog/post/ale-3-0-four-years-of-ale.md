---
title: ALE 3.0 - Four Years of ALE!
date: 2020-09-09 22:45:00
tags: ["ale", "vim"]
---

Just a moment ago, I released [version 3.0.0 of ALE](https://github.com/dense-analysis/ale/releases/tag/v3.0.0).
This version of ALE has been released on the **four year anniversary of ALE!**
Four years ago, on this very same day, was when I made the very first `git`
commit for ALE. ALE was originally released in [the same week that Vim 8.0 was
released](https://groups.google.com/g/vim_dev/c/CmiGxtJ7fn4). (Search the page
for "w0rp.") In that time, I have gone from being a regular-old developer to a
team leader, I am very close to getting married, and the entire world has gone
to Hell in a repeat of what happened in 1918.

It's been difficult to find the time to work on ALE in the past year, but I have
made a huge push in the past couple of months to get a lot of important work
done. [The changelog for version 3.0.0](https://github.com/dense-analysis/ale/releases/tag/v3.0.0)
of ALE contains many important changes, from many weeks of work from both myself
and others. The full list of changes is long, but here are some important
changes which I personally like a lot.

* ALE supports the way project configuration works with newer
  [ESLint](https://eslint.org/) versions.
* [Pylint](https://pypi.org/project/pylint/) checking now checks files as you
  type if the version of Pylint is new enough, and works just like before if you
  have to stick with an older version.
* [Pyright](https://github.com/microsoft/pyright) should work without any
  configuration, or *very little* configuration at the very least.
* You can use a new `ALEImport` command to just import something at your cursor
  if there happens to be a completion result you can get that will import it.
* You can configure ALE to automatically fix your code after inserting
  completions.
* `gcc` and `clang` linters have been merged into a uniform linter, which
  automatically gets compiler flags from `compile_commands.json` files in
  *generally good* way.
* It's now possible to run linters in Docker, in a virtual machine, or even on
  some remote machine.

There are even more goodies in the changelog to look for. I would like to once
again thank everyone who keeps contributing to the project. I was able to get a
lot more pull requests merged recently thanks to [the Stale
bot](https://github.com/apps/stale). I firmly believe that *issues* are never
"stale," and should only be closed if they are resolved in same way, but *pull
requests* certainly go stale, and getting the bot to nudge people or myself has
really helped a lot.

I'd like to thank the "Dense Analysis" teams for all of their help. "Dense
Analysis" is the GitHub organisation I created just so I could configure
permission levels for ALE. If anyone feels like they can help manage ALE issues,
pull requests, or possibly help with ALE maintenance, please don't hesitate to
shoot me an email at
[dev@w0rp.com](mailto:dev@w0rp.com?subject=Helping%20with%20ALE). It takes a
while to vet people before they can be given enough permissions, but any help is
appreciated.

Here's to another four years of ALE. Cheers!
