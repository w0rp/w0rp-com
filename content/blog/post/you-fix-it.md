---
title: You Fix It
date: 2018-03-04 15:02:58
tags: ["free-software", "github"]
---

I've been working on a moderately successful Vim plugin for a while, called
[ALE](https://github.com/w0rp/ale). All the while, I've been musing about what
my responsibilities are, having written a plugin that people like, and where
people create issues on GitHub asking for new features, or reporting bugs.
Owners of GitHub projects are expected to merge pull requests from
others, fix bugs, and make the software better. However, this social
expectation is the opposite of the legal obligations, or the lack thereof,
presented in software licences. Allow me to explain.

## The Legal Language

To understand responsibility for fixing bugs and providing new features, you
need to understand the language around warranties. ALE uses a 2-clause BSD
licence, which is very popular. Let's look at the full licence text.

{{< rawhtml >}}
<div class="hljs">
<p>Copyright (c) 2016-2018, w0rp &lt;devw0rp@gmail.com&gt;<br>All rights reserved.</p>

<p>
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
</p>

<ol>
<li> Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
</li>
<li> Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
</li>
</ol>
<p>
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
</p>
</div>
{{< /rawhtml >}}

Here are the important points.

1. The software copyright is assigned to my pseudonym, that I represent.
2. The licence permits people to do basically anything they want, as long as
   they give credit for it.
3. The very, very long text at the end explains warranty.

More specifically, what the warranty text at the end explains is that any
"express or implied warranties" are "disclaimed." In legal language,
"disclaimed" means that they are ["repudiated" or
"renounced."](https://thelawdictionary.org/disclaimer/)
This is a roundabout way of explaining that there are no express or implied warranties.
This affords important legal protections
for free software developers. The developers of software cannot be held liable
for any accidents that arise because of software they wrote and put online, or
any modifications thereof, giving developers freedom to put new ideas out there,
free of consequence.

The legal language is also very similar in other licences. I believe the
language is perhaps easier to understand in the MIT licence, which is as
follows.

{{< rawhtml >}}
<div class="hljs">
<p>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</p>
</div>
{{< /rawhtml >}}

The legal protections might not be as strong because the licence doesn't use the
special magic keywords that the BSD licence does, but I wouldn't know. I'm not a
lawyer, I just write software.

## You Fix It

The licence for my software, and for most free software projects, clearly
explains that I, as a copyright holder and project manager, am not under
any legal obligation to maintain that software, fix bugs, or to provide new
features. The social obligations ought to follow the legal obligations. Once
this is understood, it changes the way you think about free software projects
and GitHub issues.

When you create an issue on GitHub for a free software project, you are either
reporting a bug, asking for help, or asking for new features. Your expectation
should not be that others help you. No one is under any obligation to help you,
or to do what you want. When someone does write some code for you, they do it
either for their own entertainment, or because there is mutual benefit involved.
Your first thought when creating an issue should be that **you** should try to
resolve it.

Free software is liberating precisely because the control over software belongs
not to any project managers or a computer system, but to you. You are able to
modify and redistribute the software as you see fit, and you are encouraged to
tinker with software to your heart's content. I firmly believe this is why free
software projects are more likely to survive and continue to be useful far into
the future. Laziness, inability, disability, death, pride, and any other variety
of circumstances on the part software managers, for a free software project,
will not prevent anyone from modifying software and redistributing it.

When you create an issue on GitHub and after several months ask, "Why hasn't
this issue been resolved yet? It is really important to me," the answer is
simple. The answer is that **you** haven't fixed it yet.
