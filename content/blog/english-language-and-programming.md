---
title: The English Language and Programming
date: 2014-03-23 20:37:00
tags: ["programming", "style"]
---

Programming is an art form, and I believe there exists such a thing as
"beautiful code." Beautiful code has the appearance of elegance in its design.
Its form is concise, expressive, and one of its attributes is a good use of
language. Not just in the use of the syntax of a programming language, but in
its representation in natural languages.

The lingua franca of computer programming is English. More specifically
**American English**. Whatever the history may be, we have definitely settled on
this particular dialect of the English language as being the basis for how we
should name our symbols in our programs.

I believe a key to writing code that is clear and easy to understand is to make
the best possible use of the English language. Thus, I present everything I have
learned about how to format your code such that the text you have typed will be
made easier to read by other human beings.

## Stick To the 80 Character Limit

When writing code, it is important that the code you write appears consistently
in a format that is easier for people to read. A line of code has to end at some
point, it would be crazy to let a line run on forever. Thus, it is important to
decide *when* a line should end. I have a definitive answer for this for nearly
all cases, *stick to 80 characters*.

The 80 character limit, as near as I can tell, dates back to
[IBM punch cards](http://www.columbia.edu/cu/computinghistory/cards.html).
Although technically a little shorter than 80 characters, the punch cards set a
technical limitation how long a line of code was allowed to be. Latter in
history we received
[fancy terminal computers](http://www.columbia.edu/cu/computinghistory/vt52.html)
with 80 character limit on their display. As time went on and technology
advanced, we could fit more and more characters onto a display.

So time has passed, those old terminals now seem like cheap toys compared to the
computing power of our mobile phones. Why bother supporting such an old
character limit? *Because it matters*. As each year passes, I keep coming back
and finding reasons to stick to the 80 character limit. I get a large monitor
and I think I'm good, then I have a netbook where the screen is so small that 80
characters is about as high as the limit goes. You get two monitors at a desk
and you want to look at four things at once in our complex world, and 80
characters will fit on one half of one screen comfortably. I actually use an HD
TV exclusively at home at a much higher than normal DPI setting, and again 80
characters is over half the width of my screen.

The limit still makes sense, it's nice and concise and we should stick with it.
We have to have some kind of limit, so let's stick with the one that fits nicely
on a range of different displays.

I would like to mention some notable exceptions to this limitation. In languages
where lines are extremely verbose or encourage heavy nesting, I would relax the
limit somewhat to maintain sanity. Notable exceptions to the rule I believe
would be HTML and perhaps Java code, although even with Java I have found I can
often stick to 80 characters consistently. I have been able to make HTML more
manageable by switching my tab size down to 2 spaces, and that leads me to my
next topic.

## Use Spaces, Not Tabs for Indentation

As we are in the business of writing code that will be displayed consistently
across different devices, I must express my desire that we stick to spaces and
not tabs for indentation. Tab characters are designed so they can provide a
flexible amount of indentation in lines. So a tab could be the width of 4
characters, or it could be the size of 8 characters. It's up to the editor to
decide. So when indenting code with tab characters while trying to keep to an 80
character limit, you put yourself into a stochastic system of presentation where
your code could fluctuate wildly in its visual quality between displays.

Do yourself a favour and start using an editor that makes it easier to print
individual space characters instead of tab characters. Use an editor which
provides a visual hint for when tabs are present in a file instead of spaces. It
is the right choice to make.

## Identify Conventions for Names, Apply Them Consistently

Some choices for style simply do not matter too much, and debating their use is
a waste of energy. I believe the following alternative choices simply do not
matter.

* `lowerCamelCase` and `names_with_underscores`
* Allman or {{< rawhtml >}}<abbr title="One True Brace">OTB</abbr>{{< /rawhtml >}}
  styles braces
* Global constant values `as_normal` or `AS_UPPERCASE`
* Operators before or after a line break

Your choices for the above should be based entirely on what the community around
you has already decided. You can argue until the end of time whether using an
underscore in a variable name will make it easier to read, but someone else will
be there to say the opposite. Just pick whatever the majority ruled already, it
really does not matter. Whatever was chosen, stick with it.

### Almost Never Use Plural Nouns for Variables

This is a personal choice, and an important detail I haven't seen mentioned much
on the style guides of others. After some frustration in trying to read code I
or others have written, I must insist on a rule for variable names. With very
few exceptions, **variable names should never be plural nouns**. In order to
explain why, let's look at an example in Python.

```python
for object in objects:
    foo(object)
```

There you go, a simple foreach loop through some objects, using an object.
That's not so bad, is it? Let's try another one.

```python
objects = ...

for object in objects:
    foo(object)

# ... A few lines later ...

bar(object)
```

Now things are getting a bit more confusing. What did we do? We passed the
`object` items in `objects` to `foo`, and we passed `objects` to
`bar`. Except we didn't. Our code had a bug in it and we actually passed the
very last `object` in our sequence of objects on to `bar`.

Was this mistake hard to make? I think quite the opposite. I think we've chosen
to use language here in a way that makes it easy to create bugs and cause wildly
different sets of behaviour by simply changing a single character in a name. I
think this is unacceptable. We cannot simply press on writing code this way, as
it's a recipe for failure.

I have seen this type of bug appear more than once, even in static languages.
And even when there are no bugs, your code still becomes hard to read. Move away
from your screen a little and try to pick our which name describes our sequence
of objects and which one is a single object. It may be easy when you already
know which is which, but come back to the lines months later and you'll find
your function hard to read.

There *is* a better way. Instead of using a plural noun for a variable, use a
phrase combining two singular nouns in a manner which implies both that the
variable holds some kind of collection, and also the *kind* of collection it is.
I say *kind* because I wish to avoid saying instead
{{< rawhtml >}}<q>type</q>,{{< /rawhtml >}} as that would
imply something useless like
[Hungarian Notation](https://en.wikipedia.org/wiki/Hungarian_notation#Disadvantages).
I believe instead what you should say with a name shouldn't strictly be a
reference to the variable's type as the program understands it, but to what it
means semantically for how it's going to be used.

Let's return to our second Python example with this in mind.

```python
object_list = ...

for object in object_list:
    foo(object)

# ... A few lines later ...

# This now stands out like a sore thumb.
bar(object)
```

Above here I have used `object_list`. Now the `object` and the list of those
objects are easy to tell apart. I called my variable 'list' because I'm
communicating that it holds a list of values. I would use similar language to
communicate semantic meaning elsewhere.

```python
# Actually a type named 'list'.
object_list = [1, 2, 3]

# A tuple, which is also conflated with being Python's immutable list type.
object_list = (1, 2, 3)

# A dictionary, it maps from A -> B
object_map = {"a" : 1, "b": 2, "c": 3}

# 'seq' because it's a sequence, we can't guarantee we can run
# through the sequence twice.
object_seq = (x for x in object_list)
```

We have added on a bonus of giving some clues of what the thing is that we are
using in addition to making it easy to tell scalars apart from non-scalars. The
latter detail is the more important one by far, but differentiating the kind of
thing a variable represents will also make our code more readable. Consider the
alternative.

```python
foos = ...
bars = ...
joes = ...
daves = ...
```

What are each of the things above? How can you expect to work with them? Perhaps
if we introduce the values we might know.

```python
foos = [1, 2, 3]
bars = {"a" : 1}
joes = (x for x in foos)
daves = (4, 5, 6)
```

Now we know what they all are. So what if we introduce the rule and take away
the values?

```python
foo_list = ...
bar_map = ...
joe_seq = ...
dave_list = ...
```

You don't need to know the values any more, or even the types. You just need to
read the name to figure out what is what. *This one* you can expect to index or
iterate through a few times, *the other* is an input range, *some other thing*
is actually a map, and probably unordered. This is a much better way of naming
your variables, use it today as I do.

### Use Words to Convey Meaning, not Numbers and Booleans

Let us consider a line of code in Python.

```python
render("last", 100, True)
```

Can you tell me what the above line of code means? There is a string of
characters in there, then a number, then some Boolean value. But what does any
of it actually do? The answer is to somehow convey some kind of meaning. A good
way to do this in Python would be with keyword arguments, which can be applied
to any argument in Python function.

```python
render(
    target="last",
    animation_speed=100,
    use_blast_processing=True
)
```

Now our nonsense function makes a lot more sense. Despite the fact that the
example is obviously very contrived, you can at least tell at a glance what the
purpose of each argument is in. Not every language offers keyword argument
syntax, so for other languages we will have to express this idea through other
means.

For JavaScript, we can change our function so that it takes an object instead.

```js
render({
    target: "last",
    animation_speed: 100,
    use_blast_processing: true
});
```

For a static language like D or Java, perhaps we might consider breaking our
function up into other names which will effectively partially apply our function
from before.

```d
renderTarget("last")
.withAnimationSpeed(100)
.useBlastProcessing()
.render();
```

Objective-C deserves a special mention, as its syntax for messages forces you to
write code like this.

```
[Renderer
    renderTarget: @"last"
    withAnimationSpeed: 100
    usingBlastProcessing: YES
];
```

Whatever your solution is to this naming problem, just don't write crap like
this.

```c
xlConjugateScene(1, 1.0f, NULL, *p, NULL);
```

The [Boolean Trap](http://ariya.ofilabs.com/2011/08/hall-of-api-shame-boolean-trap.html)
deserves special mention here. Generally, you should remember one important
rule.

{{< rawhtml >}}
<blockquote>Never, ever, use Boolean values as arguments.</blockquote>
{{< /rawhtml >}}

For all of the reasons mentioned in the linked article and reasons mentioned
above, you should never use Boolean values for your function arguments. Often a
good alternative is to use enum values instead. As a less contrived example,
let's look at a function I am using for my DQT library, defined in my
DSMOKE library.

I could have written this...

```d
generator.writeToDirectory(
    "generator/dqt_predefined",
    "source/dqt",
    true
);
```

However I instead chose to write this.

```d
generator.writeToDirectory(
    "generator/dqt_predefined",
    "source/dqt",
    CleanBuildDirectory.yes
);
```

Perhaps I still might have to explain what the first two arguments are for, but
I'm sure you can agree that without even looking at any part of the library
before, you can come away from the code above knowing exactly what that third
argument does in the second example. All it required was the addition of an enum
type.

```d
/* 'yes' is value 1 so if(...) works well. */
enum CleanBuildDirectory: bool { no, yes }
```

Just a very small amount of additional code, and we can build readability into
our function signatures directly.

## That's All for Now

That's all for now. I may consider adding more rules I have thought of in
future. This was at least a good start on my exploration of style.
