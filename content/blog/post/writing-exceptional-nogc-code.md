---
title: Writing Exceptional @nogc Code
date: 2015-04-12 17:17:00
tags: ["d", "exceptions", "nogc"]
---

**Update:** D now supports an experimental `@nogc` exception mechanism. Consider
using this instead: https://dlang.org/changelog/2.079.0.html#dip1008

The D programming language offers an interesting feature I really like, as of
recent compiler versions. You can add a `@nogc` annotation to functions to
disable garbage collector allocations for a function, and the compiler will
check for any such allocations and return a compile time error if the function
causes any allocations. This feature is useful, as the language contains many
features which use the garbage collector, and it can be sometimes difficult for
a human to detect all of those allocations. Garbage collector allocations can
result in collection cycles, which can be a huge problem for *real time* or
*soft real time* applications. So the language offers a feature to prove there
are no such allocations in your code, and therefore makes it easier to write
such applications.

One problem with the `@nogc` annotation is that all runtime, non-static, garbage
collected allocations are disabled, and therefore is not possible to create a
new garbage collected exceptions in a `@nogc` function. Here, I will discuss
some alternatives you can use to get around this issue, and what's coming in the
future to address this issue.

## The Problem

To give a short description of the problem, using a completely arbitrary error,
let us assume you want to report an error if a function you write has a value
which is not greater than `3`. Let us play pretend that this validation in
particular is somehow actually more complicated than it is, so we can imagine
that somehow we can only know about this bad value during runtime. So your first
thought might be to write this.

```d
@nogc void foo(int x) {
    if (x < 3) {
        // The compiler will raise an error about this line.
        // It uses 'new', so it uses a GC allocation.
        throw new Exception("x has to be at least 3!");
    }
}
```

You write a function which takes your value, and you throw some exception when
the value is, by some measure, *the wrong value*. The problem now is that you
cannot create a new exception, as that's an allocation with the garbage
collector, and your function explicitly forbids those allocations.

## Solution 1 &ndash; Use Assertions

The first alternative solution I propose is to use assertions or contracts to
report errors for a bad value. There are advantages and disadvantages to this
approach. The advantages are as follows.

1. You can disable the assertions and contracts in your production build, if you
   use them only to prove during development that such errors will not be
   created. This can be an advantage if you don't want to pay the runtime cost
   for the checks.
2. The assertions are short and simple to write, and it is obvious where they
   originate from.

The disadvantages are as follows.

1. Disabling assertions and contracts might lead to bugs in your production
   builds, in which case you might have to make a choice to leave them enabled
   in your final build, which carries a runtime cost.
2. Assertions are `Error` instances, and `Error` instances are not supposed to
   be caught and dealt with in your program. `Error` instances are designed to
   be so bad they crash a program, and catching them is forbidden in `@safe`
   code. If you wish to catch your exceptions, this can be a problem for you.

With an assertion, the function looks like so.

```d
@nogc void foo(int x) {
    // This is OK.
    assert(x >= 3, "x has to be at least 3!");
}
```

With a contract, still using an assertion, the function looks like so.

```d
@nogc void foo(int x)
in {
    // This is OK.
    assert(x >= 3, "x has to be at least 3!");
} body {
}
```

Some programmers don't like contract syntax so much, some programmers love it. I
happen to be one of the latter, as I like the visual separation between
pre-conditions and the implementation of a function. There also exist `out`
contracts which can taken an optional return value for validating return values,
or rather post-conditions. You can pick a style which suits you.

I will also note that any assertion which can be statically proven to always
fail when the line is reached will remain in D programs, even when assertions
are normally removed. In simpler terms, that means to keep an assertion in the
program in 'release' mode, simply change the example above wrapping a failing
assertion in an if statement.

```d
@nogc void foo(int x) {
    if (x < 3) {
        // This line will not be removed in production code.
        assert(false, "x has to be at least 3!");
    }
}
```

These types of assertions are designed for truly fatal errors, for lines of code
which ought not to ever be reached under any circumstance. Use them sparingly,
and try to keep that principle in mind.

## Solution 2 &ndash; Use Error Objects

This solution comes primarily from my experience with working with Objective-C,
and should also enable some more verbose error reporting in functions which can
also be marked as `nothrow`. The solution works like so.

1. Create a type for holding error information in them, much like an exception.
2. For every function call, pass in a reference to an error object with the
   other arguments, to be filled with a possible error.
3. Check for an error for every invocation of a function.

There are advantages to this approach.

1. You can perform some error reporting in functions which are not only `@nogc`
   functions, but are also `nothrow` functions. This means you won't have to
   deal with issues with stack unwinding, and this will make the code usable in
   environments where exceptions cannot be used at all, like embedded chipsets.
2. You can add runtime information into your error types, so you can produce
   better error messages at runtime.

The disadvantages can be quite objectionable for some.

1. Your code will not be correct unless you explicitly check for errors for
   every invocation. Programmers who use your functions, including perhaps
   yourself, will be tempted to ignore the errors and press on anyway. This can
   create all manner of headaches.
2. Your function signatures will be more ugly and take more work to call, as you
   will have to pass in your error objects with each function call. Handling
   errors this way requires quite a bit of boilerplate.
3. Passing the error objects around will create a probably unavoidable runtime
   cost.

Before I show example code, I will make a note about how the approach here will
differ from Objective C. In Objective C, errors are created with pointers to
pointers, and the objects are reference counted with
{{< rawhtml >}}<abbr title="Automatic Reference Counting">ARC</abbr>.{{< /rawhtml >}}
D does not offer such a facility at the moment,
and reference counting can become quite complicated, so instead in D, I use
simple struct values.

You can adjust the solution to use reference counted objects with heap
allocation if this is not acceptable for your use cases. For me, it looks like
this.

```d
// Write more readable than 'false' and 'true'
enum HasError: bool { no, yes }

// Some error codes to store in our error type.
enum SomeErrorCode { numberOkay, outOfRange }

// A struct, using D's default initialiser behaviour.
struct SomeError {
    // Mark the data private, so we can't modify it later.
    private SomeErrorCode _errorCode;
    private int _number;

    // Write a constructor so we can set the private data.
    @nogc @safe pure nothrow
    this(SomeErrorCode errorCode, int number) {
        _errorCode = errorCode,
        _number = number;
    }

    // Offer some read-only properties.
    @nogc @safe pure nothrow
    @property SomeErrorCode errorCode() const {
        return _errorCode;
    }

    @nogc @safe pure nothrow
    @property int number() const {
        return _number;
    }

    // Implement something so `if (error)` will work.
    @property
    bool opCast(T: bool)() {
        return errorCode == SomeErrorCode.numberOkay;
    }
}

// Now our function returns HasError.yes if the function failed, and
// outputs an error with some information when it does.
@nogc nothrow
HasError foo(out SomeError error, int x) {
    if (x < 3) {
        // Here we set the error.
        error = SomeError(SomeErrorCode.outOfRange, x);
        // Report that we set an error.
        return HasError.yes;
    }

    // If everything went well, say no errors occurred.
    return HasError.no;
}

void main() {
    import std.stdio;

    SomeError error;

    if (foo(error, 2)) {
         // writeln isn't @nogc nothrow, but you can imagine something else.
         writeln("This number was wrong: ", error.number);
    }
}
```

This solution uses the `out` reference feature of D. `out` references are like
ordinary references, only they always default initialise the value before it is
assigned to. So the error message will never be set with something other than
either "no error," or what the function assigns to it. Using these references to
error objects means that structs for error objects will have to have a default
state meaning "there was no error." Doing this correctly can takes some
consideration, but at the very least it can be accomplished with an extra error
code for "no errors," a boolean flag, or checking if an object contains some
invalid value.

As stated previously, this solution requires a lot of boilerplate to work with,
and can lead to writing some incorrect code, when the errors are ignored.
However, this solution can be ideal when exceptions simply cannot be used at
all, which could be the cause in very limited environments. If the error code is
all the information you really need, you can also decide to forgo the objects
entirely, and simply return an error code with an enum type. Let it not be said
that I did not suggest error codes as a possible solution.

## A Pitfall &ndash; Allocating Exceptions Statically

One exception to the `@nogc` checks is static allocation. `static` variables in
D, much like in C++, are only allocated once. In D "once" means "once per
thread", as D's types are thread-local by default, and if a `shared static`
variable is used, the variable will only be allocated once globally. Because we
can allocate static variables with `new`, even in `@nogc` functions, then we can
also allocate static exception variables.

However, there is a problem with this approach. Consider the following example.

```d
@nogc
void foo(int x) {
    if (x < 3) {
        static const exception = new Exception("x has to be at least 3!"); throw exception;
    }
}
```

The static initialised variable will only be initialised once, despite its
location inside of a function. This can take some getting used to. C++
programmers might find this natural already.

The problem with this approach is that in order to set up the stack trace for an
exception, the trace is set after the exception is thrown. Consider the
following application of the function above.

```d
@nogc
void main() {
    try {
        // This will throw an exception.
        foo(2);
    } catch (Exception err) {
        // This will throw exactly the same exception again.
        // Now have changed the original exception still
        // in flight, as they are one and the same!
        foo(2);
    }
}
```

For this reason, we cannot consider this as a possible solution.

## The Future

Not being able to use exceptions perhaps as effectively as you might like in
`@nogc` functions is a known problem in the D community, and the implementers of
`@nogc` already understood the problem. They simply did not have a workable
solution at the time `@nogc` was implemented. Some work is being done on the D
language to add
{{< rawhtml >}}<abbr title="Automatic Reference Counting">ARC</abbr>,{{< /rawhtml >}}
including for class types, to the language. Once D can support
{{< rawhtml >}}<abbr title="Automatic Reference Counting">ARC</abbr>,{{< /rawhtml >}}
reference counted exceptions are sure to follow.

In future, I can suggest **Solution #3 &ndash; ARC** for exception types, which
might some day end up becoming the general solution for the language. Until that
day comes, you can try my suggestions above, or indeed come up with your own
solutions.

For the moment, `@nogc` in D also appears to imply `nothrow`. As you cannot
create new exception objects at all, at least in a safe manner, it is simply not
possible to throw an exception from a `@nogc` function at the moment. If your
function has the former annotation, it can probably have the latter. Other
`Throwable` objects can be thrown, but they are designed to be treated as fatal
errors for crashing an application. `Throwable` objects can be thrown which are
not `Exception` types from `nothrow` functions for this reason.

If you enjoyed this article, please feel free to share it around and add your
comments below. I hope my ramblings will be of use to someone else.
