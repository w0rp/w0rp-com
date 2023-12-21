---
title: An RAII Constructor by Another Name Is Just as Sweet
date: 2015-04-09 23:00:00
tags: ["d", "raii"]
---

I'm going to talk about
{{< rawhtml >}}<abbr title="Resource Acquisition Is Initialization">RAII</abbr>{{< /rawhtml >}}
in D, which should be a familiar term to anyone familiar with C++. It is one of
the more unfortunately named, but incredibly useful idioms for managing
resources. In particular, I'm going to show how a feature of D I once thought
was an annoyance, turns out to be quite essential, and how another feature of D
I once thought could be a problem turns out not to be a problem at all.

To begin, let us say you want to create a struct in D for a resource. Okay, the
most obvious example is a file. For those who know how file handles in C
actually work, **do not panic**, this is just an example to get the point
across.

```d
struct File {
    private FILE* fileHandle;

    this(string filename, char[] modes) {
        /* voodoo happens here. */
    }

    ~this() {
        /* The file is destroyed here */
    }

    @disable this();
    @disable this(this);
}
```

If you are less familiar with D, perhaps coming from a C++ background, you will
probably think, "Okay, I got the private data member, the 'this' thing there
looks like a constructor, the thing after must be your destructor, then I got
kind of lost once the `@disable` thing came in." Not to worry.

The last two lines in the struct do two things.

1. Disable default construction for a struct.
2. Disable copying for a struct.

What this means is that it is not possible to create a `File` without
initialising the file with a value, which should be done via our constructor
which takes a filename, and it is not possible to ever copy a `File`, which
means you can't have a destructor run twice and then find yourself in a
situation where your resource has been cleaned up before you were done with it.
For C++ programmers, this should seem natural, especially for C++11 programmers,
who should be familiar with the `delete` keyword for disabling copy
assignment and constructors.

After I had been writing D code for a while, I discovered a feature of the
language which threw me off a little. For any type T in D, there exists a
`.init` property which gives you the initial value for that type. So
`int.init` will give you an integer which is 0, `float.init` will give
you a
{{< rawhtml >}}<abbr title="Not a Number">NaN</abbr>{{< /rawhtml >}}
value, etc. `.init` is supposed to give you some consistent but not very
meaningful value for any type, so you can initialise a value to at least
something.

It turns out for structs, the `.init` value creates a struct which uses the
initialisers for all of the values held in it, transitively, but not any
constructors. It will skip all invariants, which require runtime checks, and you
can also use it even when **default construction for a struct is disabled**. My
initial reaction to this was one of confusion, but I eventually accepted it and
remembered how it worked. This was the feature that annoyed me a little.

```d
struct CantConstructMe {
    int x;

    @disable this();
}

void main() {
     // This is a compile-time error.
     CantConstructMe nope;

     // This is fine, fine.x will be 0.
     auto fine = CantConstructMe.init;
}

```

The feature I thought could be a problem for writing complex software in D is
that you cannot write zero argument constructors for structs in D. My
understanding is that this avoids having constructors for struct types, and only
struct types, cause some potentially unpredictable behaviour when a struct is
simply declared in D without an assignment with which to initialise it. In
*plain D*, this means the following.

```d
struct ThisWontWork {
    // This will cause a compile time error.
    // You can't do this!
    this() {}
}
```

So you can't write a constructor for a struct in D without any arguments for the
constructor. However, D has another feature which makes this less of an issue.
If you return a struct from a function in D, it does not *copy* the struct, like
assignment would, it *moves* the struct out to the return value. So this works.


```d
struct Moveable {
    // This isn't copyable.
    @disable this(this);
}

Moveable foo() {
    Moveable returnValue;

    // This doesn't copy the struct, it moves it.
    return returnValue;
}

void main() {
    // The struct is moved into 'value' here.
    auto value = foo();
}
```

Now if you are writing D code and you want to make it look a little more obvious
at a glance, you can use a static method instead.

```d
struct Widget {
    @disable this(this);

    // We can use typeof(this) so we can change the name easily
    // without having to change it here also.
    static typeof(this) create() {
        typeof(this) widget;

        return widget;
    }
}

void main() {
    auto widget = Widget.create();
}
```

So now we have an idiom for constructing structs with no arguments, even though
we don't have any zero argument constructors in the language. I think that is
pretty neat. However it turns out that the language feature I mentioned before
which I used to think was *annoying*, also marries up with this idiom in a
rather nice way. Consider the following.

```d
struct Widget {
    int x;

    // Now we are disabling default construction too.
    @disable this();
    @disable this(this);

    static typeof(this) create() {
        auto widget = typeof(this).init;

        // We can construct our members in our static function.
        widget.x = 3;

        return widget;
    }
}

void main() {
    // This still works fine.
    auto widget = Widget.create();

    // However this is now illegal.
    Widget anotherWidget;
}
```

So now we have done something interesting. We have a struct which isn't
copyable, can't be constructed with a default constructor, but which we can also
construct with a zero argument static function call. What this means is that we
can create resources without passing any arguments into a constructor in D. Now
to finally reveal the power of the idiom in its completion, consider the
following.

```d
struct Bitmap {
    /* private bitmap data held here */

    @disable this();
    @disable this(this);

    static typeof(this) loadPNG(string filename) {
        auto bitmap = typeof(this).init;

        /* Load bitmap data from a PNG here... */

        return bitmap;
    }

    static typeof(this) loadJPEG(string filename) {
        auto bitmap = typeof(this).init;

        /* Load data for a JPEG */

        return bitmap;
    }

    static typeof(this) loadGIF(string filename) {
        auto bitmap = typeof(this).init;

        /* Load data for a GIF */

        return bitmap;
    }
}


void main() {
    auto jpeg = Bitmap.loadJPEG("something.jpg");
    auto png = Bitmap.loadPNG("something.png");
    auto gif = Bitmap.loadGIF("something.gif");
}
```

So now we have a resource we can construct in a number of different ways,
possibly using the same types for arguments, but providing different behaviour
explained by the names of the static methods. It's perhaps not a very good image
processing API, but it illustrates the point. You can write RAII types in D
which can be constructed via any number of functions, which cannot be copied,
and cannot be default constructed. So assuming you don't abuse `.init`, and
instead use it in order to enable this idiom, you can create resource types
where you can be certain they have been constructed in a reasonable manner, and
constructed in a number of different ways.

Neat, huh?
