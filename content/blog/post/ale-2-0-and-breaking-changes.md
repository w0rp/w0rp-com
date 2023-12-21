---
title: ALE 2.0 and Breaking Changes
date: 2018-06-03 21:20:00
tags: ["ale", "vim"]
---

Only just a few days ago, [ALE](https://github.com/w0rp/ale) reached 5,000 stars
on GitHub. I believe that a measure is only good if it doesn't become a target.
While the number of stars my projects get on GitHub isn't a target for me, I do
appreciate the support from the fans of the project. Seeing that little counter
of stars go up so the over time gives me a little warm feeling inside, and
encourages me to continue working on the project.

Right around the same time, I managed to complete a version 1.9 release for ALE.
The releases on GitHub, I imagine, are mostly a formality for quite some people,
although they do appear in some package repositories. This particular release is
an important one. This will be the first release where I deprecate functionality
in ALE, before removing it in the next version. The coming 2.0 version of ALE
will be the first release where I will deliberately introduce breaking changes.
Purely for comedy value, I've decided to release this version on July 4th. This
will be the day I celebrate independence from older versions of NeoVim that
prevent ALE from using lambdas and closures.

On that note, I feel it is a fitting time to discuss what is or is not a
breaking change, and the considerations I've made while developing ALE.

## What Is a Breaking Change?

The answer is, in short, *basically anything*. That's not a practical or useful
answer, though it is probably the truth. One of the best discussions I've seen
of surprising breaking changes came from a CppCon presentation by Titus Winters,
during his talk "C++ as a 'Live at Head' Language." I have linked the time code
in the embedded video below.

{{< rawhtml >}}
<iframe width="560" height="315" src="https://www.youtube.com/embed/tISy7EJQPzI?start=1290" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
{{< /rawhtml >}}

Consideration for breaking changes essentially lies in anything you have
documented as feature of your API. Your changes besides what you have documented
will almost certainly break something for someone somewhere, but if you lived in
fear of that, you would never change any code ever. The long and short of it, as
far as Vim plugins are concerned, is that all of the following are breaking
changes.

1. Changing the names of any documented functions or commands.
2. Changing the names of any documented `User` autocmd events.
3. Adding non-optional arguments to any documented functions or commands.
4. Changing the name of any variables you use as options.
5. Changing the names of any `<Plug>` commands.
6. Using any features only available in newer Vim versions than your lowest
   supported one, without some way of reasonably opting out.

## Handling Breaking Changes

I could probably think of more examples, but the interesting thing to note is
that you must consider any new features you develop with care, with the
knowledge that once you add things in, removing them requires even more care.
There are two short solutions to the threat of breaking changes in whatever API
you are developing.

1. Only promise to keep that which you officially support and document.
2. Before breaking anything, warn people first, and give them time to adapt.

I have handled this in ALE by outputting warnings when deprecated tools are
used. Consider the following code.

```vim
" remove in 2.0
if has('nvim') && !has('nvim-0.2.0') && !get(g:, 'ale_use_deprecated_neovim')
    execute 'echom ''ALE support for NeoVim versions below 0.2.0 is deprecated.'''
    execute 'echom ''Use `let g:ale_use_deprecated_neovim = 1` to silence this warning for now.'''
endif
```

The above code comes from the current version of ALE, and tells you to upgrade
NeoVim if you are using a version which won't be supported soon. The error tells
you how to disable the warning, so you can deal with it later. ALE also has some
functions which were once part of the public API, and these functions emit
warnings when you use them too.

```vim
" remove in 2.0
function! ALELint(delay) abort
    if !get(g:, 'ale_deprecation_ale_lint', 0)
        execute 'echom ''ALELint() is deprecated, use ale#Queue() instead.'''
        let g:ale_deprecation_ale_lint = 1
    endif

    call ale#Queue(a:delay)
endfunction
```

The warning above is only issued when you try to use the deprecated function, at
most once, and tells you which function you should be calling instead.

Besides deprecation, you need to publish release notes which tell people what
you're going to remove and why, and publish notes again when things have been
removed. This has been handled ahead of ALE's 2.0.0 release.

* [Release notes for 1.8.0](https://github.com/w0rp/ale/releases/tag/v1.8.0)
* [Release notes for 1.9.0](https://github.com/w0rp/ale/releases/tag/v1.9.0)

Even if many users don't use these releases from the GitHub releases page, this
at least tells people who are pulling the master version of the git repository
what's going to happen later. It's no accident that I linked to the "Live at
Head" talk above, because one of the greatest challenges of developing a Vim
plugin is that you can never have any breaking changes whatsoever in your
master branch, by and large. The master branch of a Vim plugin project is
essentially the same as the stable branch. *There is no other unstable branch*.

## Conclusion

Good updates are coming to ALE, and some breaking changes are coming. Some
people will probably be upset, but they've been given time to adapt. I hope that
my rambling here is useful to someone. Dealing with breaking changes is perhaps
the hardest part of developing an API.
