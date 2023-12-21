---
title: null and the D Programming Language
date: 2013-02-09 20:09:00
tags: ["d"]
---

## The problem with null

Throughout my life as a programmer, I constantly experience one problem. I don't
like *null*. I imagine that the existence of null is the number one cause of
headaches for all programmers around the world. The creator of the null
reference names it [The Billion Dollar Mistake](http://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare).

The problem with null is quite obvious. Every object that could possibly be null
is a bomb waiting to go off. A bomb that can often be set without any way of
reliably determining how the bomb got there in the first place. You either deal
with null in every possible case, or wait for your program to blow up. Because
there are so many cases to deal with, you must eventually relent and allow your
program to become fragile, and therefore at the mercy of random explosions.

1. There needs to be an easy way to avoid initialisation of member variables,
   because not all members can be default initialised. This is more of a
   headache than having null.
2. There needs to be a way to represent lack of existence.

There are therefore three approaches.

1. Include null in a language.
2. Exclude null from the language, and use Option/Maybe types as the
   alternative.
3. Make operations on null do nothing without causing a pointer/reference error.

Almost all programming languages do #1. Declarative languages tend to do #2.
Scala oddly seems to offer both Option types and null, for easier Java support.
Objective C is really the only popular language I can think of that offers #3.
(Although, not reliably enough.)

The **D Programming Language** actually takes option #1, but I would like to
argue that it actually alleviates most of the headaches of having null by
avoiding it in many cases. I aim to demonstrate, over the course of several blog
posts, that D is a very good programming language because of small, perhaps
poorly documented, features of the language. These small features, when combined
together, create a whole that makes the overall language very powerful and
useful.

How it Comes Together - Sequences of Data and Numbers
============================================

I would like to argue that the vast majority of programming involves
constructing and deconstructing sequences of data. I cannot offer concrete
evidence to back up this statement, but hopefully it should be self evident. It
should hopefully be clear that the overwhelming majority of types declared while
programming will be types representing sequences, or depend on those types. I am
of course referring to character strings, lists, maps, and sets.

Aside from working with sequences, a vast majority of programming involves
working with numbers. This can be evidenced by the prevalence of operators for
numbers in programming languages. Many lines of code deal with combining numbers
in various ways.

Assuming that the vast majority of code will deal with these cases, then if it's
possible to eliminate all possibility of ever seeing null in these cases, then
the vast majority of null problems will just go away. D does this wonderfully,
and non-obviously, when the following features of the language are combined
together.

* Numbers are not objects, and cannot be null.
* ```x.func(...)``` can be syntactic sugar for ```func(x, ...)``` whenever there
  exists a compatible function.
* Arrays and maps (associative arrays) are not objects, but are part of the
  language.
* Arrays know their own length.
* Arrays and maps are copy-on-write.
* null arrays and maps can be treated like empty arrays and maps.
* Strings are not C strings, they are arrays of characters. (Literally a
  typedef.)
* D offers generics accepting value types without any type erasure.

Perhaps it might not be totally obvious, but with these features combined, the
vast majority of null headaches have been eliminated from your daily life as a
programmer. Here is how it breaks down. Suppose you have a function that returns
an array, map, or string. You know for certain that you cannot cause a null
reference error by attempting to access that data, because null arrays and maps
can be treated like empty arrays and maps.

You do not need to create nullable data structures to capture the length of
sequences, because the sequences included in the language know their own
lengths, returned by `x.length`, which actually uses the syntactic sugar
described above. (This sugar can also introduce null safety for objects with
null checks inside function bodies.)

The number one reason to make numbers objects is so they can fit inside
container objects. Containers are not objects in D, and value types can be used
in generic type parameters. So there is no reason to make numbers objects there.
D's syntactic sugar can make numbers seem like objects, by making functions look
like methods. So you at once get the benefits of numbers being objects in most
languages without needing to introduce null.

Let us create an example set of functions which exhibit these features. This
example, while perhaps not the best example, should demonstrate how D can safely
work with null sequences. As far as D goes, the problem of null sequences is
solved, forever. The numbers in sequences of numbers are also safe. They never
have to be boxed into objects in order to fit into them, like in Java. They
never are *required* to become nullable. Here is that example:

```d
int square (int num) {
    return num * num;
}

int[] some_numbers() {
    return null; // Can be treated like an empty array.
}

int[] some_more_numbers() {
    int[] num_list = some_numbers(); // Okay, we have an empty array.

    int one = 1;
    int two = 2;

    num_list ~= one.square() // Now we have [1], and we did copy on write.
    num_list ~= two.square() // [1, 4], Same copy, may have its capacity increased.
    num_list ~= two.square() // [1, 4, 4], Same copy.

    return num_list;
}

// bool[int] is a mapping where the keys are integers,
// and the values are booleans.
// This is a common pattern for representing sets.
bool[int] unique_numbers() {
    bool[int] some_map = null; // Again, actually an empty map;

    foreach(int num; some_more_numbers()) {
        some_map[num] = true; // Add this number to the map.
    }

    return some_map;
}
```

## How it Comes Together - struct and class

The only things that can cause null reference errors in D are pointers and
instances of classes. (D class instances are not exposed as being pointers, they
are higher level references.) In order to explain how D can avoid null problems
with user-defined data structures, it is worth taking about how C++ handles this
issue. In C++, variables must always be initialised to some value. It is only
when dereferencing a *pointer to a class* do you run into null problems in C++.
C++ constructs class instances on a stack, and the instances are copy-by-value.
C++ uses the *new* keyword instead construct the instances on the heap,
returning a pointer to that instance. C++ also offers *reference types* which
are references to class instances, which cannot be null.

D constructs classes instances on the heap, but offers a mechanism for stack
allocation of class instances. References to class instances can be null.
However, D treats *struct* types like how C++ treats class types. *struct* types
are copy-by-value. In D, these struct values must always be initialised, and
they cannot be null. D offers a *ref* qualifier (And other related
qualifiers...) for referencing types, instead of copying them, to achieve
something similar to C++'s reference types.

Because of this distinction between *struct* and *class* types in D, D offers a
mechanism to create easy lightweight data structures that can never be null.
This is very good, because a lot of null problems arise from references to [Java
Bean](http://en.wikipedia.org/wiki/JavaBeans) like instances being null. With D,
new simple data structures can be created without introducing null reference
problems.

To demonstrate the usefulness of structs in D, I actually have a very heavy
example on hand. [Here](http://pastebin.com/06zfRNba) is part of a geometry
module I was working on a while ago, which defines a *Point* struct for
representing points and vectors in three dimensional space, with some
convenience methods for reasoning with these points and vectors. This example
also demonstrates several other useful, perhaps poorly documented features.
(Discussion of pure functions, transitive const-correctness, properties, and
unit testing, among other features, to come later.)

## Conclusion

The D programming language includes null references, which cause many headaches.
However, I should have hopefully explained how D does this while avoiding many
of the headaches associated with null references. Many of the common fuses for
exploding the null reference bombs are avoided entirely through careful and
clever language design. Through this and further blog posts, I can hopefully
demonstrate that D is a language which should feel very familiar to most
programmers, while avoiding many of the problems of most programming languages
in clever ways.
