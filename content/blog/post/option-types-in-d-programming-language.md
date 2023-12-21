---
title: Option Types in the D Programming Language
date: 2013-02-15 20:24:00
tags: ["d"]
---

In a [recent](/blog/post/null-and-d-programming-language/), I explained in some
detail how D can often save you from the horrors of null. Here is the short
version:

* No null for primitives.
* (Effectively) no null for arrays or maps.
* No null for structs.

If D code is properly written, and often this will imply making appropriate use
of generics, then null should appear far less in your D code than in, say, your
Java code. However, what I like to call "class types" are not safe from null.
(Neither for that matter are pointers, but in higher level D code, this will not
be a concern.)

Scala is a programming language which deals with null in a sort of peculiar way.
I like to describe Scala as being "backwards compatible" with Java code, as
Scala can make use of any Java code. In order to support calling Java code
easily, Scala was designed such that any object which is a subclass of AnyRef,
which is analogous to Object in Java, can be null. However, Scala also offers
option types, via an [Option class](http://www.scala-lang.org/api/current/scala/Option.html).
For those who are not aware, option types are a way of representing types which
contain some value, or just nothing. This is similar to null references, only in
this case, accessing the reference can cause the error, not accessing the
members for the reference. This forces programmers to deal with a lack of a
value immediately, which then hopefully leads to less bugs overall.

I suggest that exactly this combination of null references and option types is possible in the D programming language. D offers another concept, nullable types, via a struct with a template parameter. This is strictly for non-class types, but I got to thinking. The
[Nullable](http://dlang.org/phobos/std_typecons.html#.Nullable) struct which
offers this functionality is already very similar to an Option type, only it
doesn't recognise classes and null. With a little modification, I could create
an Option type struct. Rather than just dream about it, I implemented it.
[Here it is](https://gist.github.com/w0rp/51394cec73fc379552c8f51703b9fb25).
The module provided is unit tested, works for all types including primitives,
(`= null` even works for non classes) and will even allow assignment from a
Nullable for compatibility with the standard library.

Here is how to make use of this module. First, an Option type can be declared
like so.

```d
Option!MyClass maybeInstance;
```

Option types will accept assignment from normal types. `= null` works here,
unlike Nullable.

```d
maybeInstance = new MyClass();
```

Option types can be implicitly converted, or explicitly via .get, to normal
types. However, this will cause an error when the value is null.

```d
MyClass instance1 = maybeInstance.get; // May cause an error.
MyClass instance2 = maybeInstance; // Equivalent.
```

Checking if a value is null can be achieved with the `isNull` property.

```d
if (!maybeInstance.isNull) {
    /* Work with the value here, now we know it's not null. */
}
```

There you have it. That's all you need to know to use this module in D. You will
never get rid of the possibility of a class reference being null in D, but you
can make that possibility far less likely by using option types and some
discipline. You can train yourself to never ever assign null to a non-option
type in the same way that you might never ever call new without using a smart
pointer in C++. You can't guarantee that code from other people won't introduce
null into your code, but you can use option types throughout your own modules.
Make a difference today. Stop being the one causing the null reference headaches
by using smart programming languages and option types.
