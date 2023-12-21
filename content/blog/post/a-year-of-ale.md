---
title: A Year of ALE
date: 2017-11-11 19:06:00
tags: ["ale", "programming", "vim"]
---

It's been a little over a year now since I started working on what is arguably
my first ever successful open source project,
[ALE](https://github.com/w0rp/ale). It's very ironic that I've been working on
ALE for over a year, given that I've been teetotal my entire life. (This is
actually mentioned *way* at the end of the help file, for those who bother to
read it.) Some friends had told me that I should write up my experience with
working on ALE so far. True to my fashion of being very lazy and proactive at
the same time, I'm now ready to produce this article two months later.

When reading this article, it will be helpful if you are familiar with Vim
scripting jargon. If you aren't as familiar with Vim, you can gloss over any
strange words you see.

## Motivation

The first question to answer with this project is, "why did I bother working on
it in the first place?" I alluded to my laziness above. Laziness is one of Larry
Wall's [three virtues](http://threevirtues.com/). I wanted a tool which would
check my code very well, so I could make fewer mistakes while working. Pointing
out mistakes and letting me fix them as quickly as possible means I spend less
time trying to fix simple mistakes, and I can focus more on the big picture.

Perhaps another virtue which could be added to Larry's list is *jealousy*. I was
working with other programmers who could run flake8 in PyCharm or ESLint in
Sublime or Atom, and they would receive information about problems in their code
while they typed. My text editor of choice is Vim. Vim is the tool that allows
me to edit code faster than any other tool. When I started working on ALE,
Syntastic was the most popular Vim plugin for checking for problems. Syntastic
and Vim at the time didn't allow you to check for errors while you type.

The reason why Vim plugins couldn't support checking for errors while you type
is that checking for errors while you type requires support for asynchronous
programming. Vim only allowed you to execute external programmings
*synchronously*. Thus, [Syntastic](https://github.com/vim-syntastic/syntastic)
could only check for errors when files were opened or saved. Worse than that,
checking for errors was a blocking operation, so you couldn't use your text
editor at all while it was checking your code. One of the main reasons the
[NeoVim](https://neovim.io/) project was started was to introduce support for
asynchronous programming in a fork of Vim. Meanwhile, when I started working on
ALE, Vim 8 was being developed, which would introduce asynchronous programming
support into Vim itself.

I really badly wanted to have the ability to check for problems while I typed in
Vim, and I kept thinking about how that functionality could be introduced. After
some thinking, I came up with a basic plan which could actually work.

## Inception

I determined that linting while you type in Vim would require the following
process.

1. Start a timer function when text is changed, and cancel the timer if the
   timer is triggered again before the delay is hit. (This is a common pattern
   in client-side programming.)
2. When the timer function is run, start some programs in the background to
   check for problems.
3. After the programs finish, display the problems in the editor in various ways
   supported by Syntastic and other plugins.

I determined that such a plugin would have to be written from scratch, and that
it actually wouldn't be that difficult to get something pretty basic working. I
could get the bare minimum amount of code working in NeoVim, and then add in
support for Vim 8 after that. With some free time on my hands and the drive to
get something done, I got started.

After some tinkering, I managed to get asynchronous linting while you type to
work in NeoVim and in a development version of Vim 8. I implemented basic
loclist support and support for signs with Vim and NeoVim. I named the project
"ALE" for "Asynchronous Lint Engine", because I have a fetish for catchy
acronyms. I threw the project up on GitHub and uploaded it to the [vim
scripts](http://www.vim.org/scripts/script.php?script_id=5449) site. I worded my
project descriptions according to the <abbr title="Search Engine
Optimisation">SEO</abbr> knowledge I have, so people could find the project
easily via a Google search like "lint while typing vim." I announced the project
[in a response](https://groups.google.com/forum/#!topic/vim_dev/CmiGxtJ7fn4) to
Vim 8.0 release thread.

Early on I came up with a set of principles for the project, which I still
adhere to.

1. The code in the project needs to be covered with a good quality test suite.
1. The project needs to support Linux, Mac OSX, and Windows.
1. The project needs to support Vim 8 and somewhat recent versions of NeoVim.
1. Just about everything should be documented.
1. The project needs to be written almost entirely in VimL. Writing the project
   purely in VimL makes it portable.
1. Linters should check for problems while you type, except when linters just
   work a lot better when they check the files on disk.
1. ALE should try and check files with as many tools as possible by default,
   except where they are too annoying.
1. ALE should prefer locally installed executables by default.

Before long, other users started opening issues on GitHub. More core
functionality already implemented in Syntastic needed to be implemented. There
were various bugs to fix. There were issues with cross-platform support to
solve. New linters were being contributed by other users. Support for tools
which just couldn't be run while you type was needed. The project started moving
along at a decent pace.

## Explosive Growth

As time has gone on, I and a few others have contributed some improvements to
core functionality. A huge number of contributors have come along to contribute
code for running linters for the languages they work with. My contributions to
ALE are now mostly focused on improving the core functionality. I maintain the
test suite and code quality, while anyone on the Internet can come along and
submit pull requests for adding or improving support for other tools. I can
think of no better way to illustrate the contributions to ALE than through
[gource](http://gource.io/).

{{< rawhtml >}}
<iframe width="640" height="360" style="max-width: 100%; width: 640px; margin: 0 auto; display: block;" src="https://www.youtube.com/embed/XT1P4t1XdpU" frameborder="0" allowfullscreen></iframe>
{{< /rawhtml >}}

I've seen ALE rise in popularity. The GitHub stars have risen from tens, to
hundreds, to about 3,300 at the time this article was written. The number of
contributors has risen.
[Articles](http://liuchengxu.org/posts/use-vim-as-a-python-ide/)
[have](https://medium.com/@hpux/vim-and-eslint-16fa08cc580f)
[been](https://medium.com/@alexlafroscia/writing-js-in-vim-4c971a95fd49)
[written](https://dmerej.info/blog/post/lets-have-a-pint-of-vim-ale/) about ALE.
ALE is going to be mentioned in an upcoming book called [Modern
Vim](https://pragprog.com/book/modvim/modern-vim) (I have reviewed the linting
section myself.) ALE is mentioned in [YouTube videos in foreign
languages](https://www.youtube.com/watch?v=uWtcQ2hJSUg). When the last version
of Ubuntu was released, around a thousand users cloned the repository in a day.
ALE has become the de facto way to check for problems with your code in Vim.

I could probably write a very long article about my experiences in interacting
with other human beings while supporting an open source project. Some people can
be very mean. Some people don't speak English so well. Some users create issues
which are very confusing indeed. Still, most people who comment are very polite.
Many people open very valid issues with all of the information required. Many
people contribute code to the project. I might write an article about working
with humans in future.

## A Growing Feature Set

As time has gone on, I've made a number of decisions for extending ALE's feature
set. Sometimes the features seem like they might belong in another plugin, but
I've had a good sense for figuring out which things matter so much that they
should be supported by ALE. In no particular order, ALE has been extended
with...

* Various ways for displaying problems, including multi-line highlights.
* Support for summaries in statuslines and various statusline plugins.
* The documentation has been expanded greatly and revised many times.
* The `:ALEDetail` command for showing more detailed messages for problems that
  are found.
* The `:ALEInfo` command for showing detailed information for debugging problems
  with ALE. (This feature has **massively** improved the speed at which bugs are
  fixed and ALE is developed.)
* Buffer-local versions of just about any setting, making it easier to configure
  different projects.
* Support for applying settings based on regular expression matches for
  filenames.
* Functions for loading tools from `node_modules`, `virtualenv`, and similar
  tools much more easily.
* Support for **fixing problems** in code. (This feature has been *very
  popular*.)
* Support for integrating with [Language Server Protocol](https://langserver.org/)
  servers, and [tsserver](https://github.com/Microsoft/TypeScript/wiki/Standalone-Server-\(tsserver\))
  for TypeScript, which is similar.
* Completion support for `tsserver`. (Support for general LSP servers will be
  added eventually.)
* Various commands for controlling ALE.
* All tests now pass in Windows on AppVeyor.
* Too many smaller features to name!

## In Closing

I'm happy I've been able to create something useful that a lot of people enjoy.
The thanks for the project don't belong to me, but to everyone who has
contributed. I would like to thank [Mark Grealish](https://www.bhalash.com/)
especially for making ALE's cool logo based on my [terrible crude
drawing](https://github.com/w0rp/ale/issues/8#issuecomment-251456591).

If you use Vim and you haven't tried ALE yet, go ahead and give it a try! I
don't think it's a stretch to say that it generally does its job *pretty damn
well*.
