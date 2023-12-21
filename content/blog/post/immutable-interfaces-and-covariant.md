---
title: Immutable Interfaces and Covariant Return Types in Java
date: 2013-09-08 21:09:00
tags: ["java"]
---

When writing data structures, you want your API for using your data structures
to be as concise and easy to understand as possible, while providing as much
safety as you can possibly get, without there being a huge amount of mental
overhead. Today, let's look at a simple example which shows how the **Immutable
Interface** pattern and also **covariant return types** can help you write code
which is more understandable, while also providing safety benefits when working
with concurrent code, and perhaps even some additional performance overhead
benefits.

## The problem with having only mutable objects.

Let's look at a simple example of a system you are trying to write. In your
program domain, you have some `Spracket`s, which hold some a number for a count
or something, and you have a `Widget` which holds a `Spracket`. So, you perhaps
write a `Spracket` object, and it might look something like this.

```java
public final class BadSpracket {
    private int count = 0;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
```

So what we have looks pretty good thus far. You've got an object, it has some
data in it, you can retrieve the data, change it. Everything seems okay. So,
let's write our `Widget` which holds these `Spracket`s.

```java
public final class BadWidget {
    BadSpracket spracket;

    public BadSpracket getSpracket() {
        BadSpracket copy = new BadSpracket();

        copy.setCount(spracket.getCount());

        return copy;
    }

    public void setSpracket(BadSpracket spracket) {
        this.spracket = spracket;
    }
}
```

Suddenly, everything starts to fall apart a little, because you want to be able
to control how your `Spracket` can be modified. So when you return a
`Spracket` you make a defensive copy of the object. (Which could have been
defined in say, a copy constructor, but that's another story.) So now every time
you want to look at the details of the `Spracket` in the `Widget`, you need to
create a copy of it. This also raises a design question, what do you copy? Just
the contents of the object itself? Do you copy transitively, in other words, do
you make a 'deep copy'? What kind of effect on memory will doing that have?

To make matters worse, there is a bug in this code. We copy the
`Spracket` **out** of the object, but we don't copy one **into** the
object. So now you could pass a reference to an existing `Spracket` object
which you can modify elsewhere, which modifies the internals of the `Widget`
without you knowing about it.

## Immutable Interfaces help

I believe that this is actually typical Java code. If you've written any Java at
all, you've surely come across this pattern of writing objects. You might not
even see any problem with writing things this way. However, I assure you, there
is a better way, and hopefully after you see this better way, you'll gain a
desire to write better code. The better way is with the **Immutable Interface**
pattern. Doubtless, someone else will have defined more 'officially' what the
meaning of this phrase is, but let's make up our own definition, right on the
spot.

{{< rawhtml >}}
<blockquote>
The Immutable Interface pattern is a design pattern whereby objects are
specified with interfaces which are immutable, and the mutable variations of the
objects implement the immutable interfaces.
</blockquote>
{{< /rawhtml >}}

So there we go, that seems like a simple enough definition of what it is, and it
should be pretty much right. So, what does all of that mean? Essentially,
instead of having the `BadSpracket` above, you first define the immutable part
of that class instead as an interface, like this.

```java
public interface Spracket {
    int getCount();
}
```

That should seem simple enough. The immutable `Spracket` cannot be modified, so
you can't set the count. So, let's create a mutable implementation of this
interface.

```java
public final class MutableSpracket implements Spracket {
    private int count = 0;

    @Override
    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
```

So now, for our `Spracket`, we've got an implementation `MutableSpracket` which
looks quite like our original `BadSpracket` example, only it implements some
interface and has an `@Override` annotation. So what is the point of all of
this? The point is, you can assign a reference to a `Spracket` with a reference
to a `MutableSpracket`. This means you can write a function which creates the
object with its mutable implementation, then calls functions with the immutable
interface. However, the most important thing is how it changes the way we can
write our `Widget`s. First, let's create another immutable interface.

```java
public interface Widget {
    Spracket getSpracket();
}
```

So again, we have a pretty small and simple interface. The details of `Spracket`
objects we just don't care about, all we care about in the immutable interface
is that we can get one. So what might a mutable `Widget` look like? Let's see.

```java
public final class MutableWidget implements Widget {
    private Spracket spracket;

    @Override
    public Spracket getSpracket() {
        return spracket;
    }

    public void setSpracket(Spracket spracket) {
        this.spracket = spracket;
    }
}
```

So great, we can create some `MutableSpracket` somewhere, pass it into the
`MutableWidget` as an immutable `Spracket`, and maybe pass the `MutableWidget`
along somewhere as an immutable Widget. So we now have a transitive system
whereby we can control access to the details of our objects, or rather, how we
modify them, as part of the object's interface. We can return references without
having to create copies of objects, which can be a performance benefit. The best
part is, we can pass an immutable reference to the object to another function
and we can expect that function not to modify the object. This makes our code
more predictable and easier to understand, and may lead to benefits in
concurrent programming.

## Covariant return types give you even more power.

We can take this one step further with a feature available to both C++ and Java,
among other languages, which it turns out yields benefits for working with this
design pattern. The whole reason for using this design pattern in Java is that
Java doesn't have C++'s notion of const, so we cannot create methods which
aren't permitted to modify the objects, and we can't create references to
objects which only let us use those *const* methods. However, as we have just
seen, we can emulate this behaviour through the use of clever design and
interfaces. What this doesn't allow us to do is change from returning mutable
references to objects to immutable references when we switch to having a mutable
reference to the container object to an immutable reference to the container
object. (In this case, the inner object would be `Spracket` and the
container object would be `Widget`.) However, I suggest that there is a
feature which ties in with inheritance which will allow us to accomplish even
this. It is the ability to specify **covariant return types**.

Let's say you return a reference to some object from a function, and you have a
subclass of that object's class. Very obviously, it is legal to return a
reference to a subclass object from that function as well. So let's take things
one step further and say that you have a subclass, or even an implementation of
an interface, which only ever returns references to objects which are subclasses
of the class. What if you change the return type of the method to the subclass
in the method override? This works in both Java and C++. The reason being is
that the return types are **covariant**. Every `Bar` which inherits
`Foo` is also a `Foo`, so it should make perfect sense that every method
override which returns a `Foo` could also be changed to return a `Bar`.

So, after some informal discussion, we should have a rough understanding of
covariant return types. Let's try and apply it to our previous example.

```java
public final class MutableWidget implements Widget {
    private MutableSpracket spracket;

    @Override
    public MutableSpracket getSpracket() {
        return spracket;
    }

    public void setSpracket(MutableSpracket spracket) {
        this.spracket = spracket;
    }
}
```

Now we have have exactly the same object, with one difference. When we pass a
reference to a `MutableWidget` to some other function, and we want to mutate it,
we can mutate the inner `Spracket` directly. Of course, we would only pass a
mutable reference when we want to change the object, because why pass a mutable
reference when we aren't changing anything? That's what an immutable reference
is for. Note that we cannot have **covariant argument types**. In a base class
interface, if `setSpracket` accepts a `Spracket`, that's the final say on what
the method can accept. All subclasses have to accept `Sprackets`, too. However
here, the setter isn't specified in any superclass or any interfaces. Its
specified only in this class itself, so no overriding happens. Thus, the
`MutableSpracket` reference can be used in both the getter and the setter.

Which this new implementation, we can now do something like this.

```java
public abstract class WidgetFactory {
    private static void incrementSpracketCount(MutableWidget widget) {
        MutableSpracket spracket = widget.getSpracket();

        if (spracket != null) {
            spracket.setCount(spracket.getCount() + 1);
        }
    }

    public static Widget createWidget() {
        MutableWidget widget = new MutableWidget();

        widget.setSpracket(new MutableSpracket());

        incrementSpracketCount(widget);

        return widget;
    }
}
```

We can create some mutable object in a function somewhere, pass it to another
side-effecting function which changes the object we give it, and then return it
as an immutable reference. When we get our `Widget` from our `createWidget`
function, and we call `getSpracket`, we'll get just a `Spracket`, which is an
immutable reference. Thus, we can have this small world of mutable references
where we can create a mutable object one piece at a time, and then give a
immutable reference to the object to the outside world when we're done.
Hopefully, this should make our code easier to reason about. The types we use in
our programs will tell us something about where modifications to objects are
taking place, interfaces accepting the immutable references will give us clues
for when we really need to make copies, etc. By changing our class structure
just a little bit, we will have hopefully created better code.

## Proceed with caution, nothing is perfect

I do not believe that any single pattern in programming is perfect, and every
system in software has some kind of flaw in it. Thus, it is important for us to
note the flaws with the solutions discussed above, and understand how to avoid
these flaws, or when not to apply these solutions.

## Casting all your cares away, for casting will cause problems

The first and foremost problem with the Immutable Interface pattern is that
you're only a cast away from creating problems for yourself. And worse still, it
might not be you creating the casts, but your users. Say you get an immutable
reference to your widget above with `Widget`. Consider what happens if you do
this.

```java
public void letsMakeAMess(Widget widget) {
    MutableWidget mutableWidget = (MutableWidget) widget;

    // Oh no! We changed it anyway!
    mutableWidget.getSpracket().setCount(347);
}
```

The Immutable Interface pattern makes the above issue a possibility. Supposing
`MutableWidget` is the only implementer of `Widget`, and `widget` and the
`Spracket` above are not null, the above code example will compile and run
perfectly, without errors or warnings, and your object will be changed. So, this
is not very good. What are our options here?

### Discourage casting, in fact, make casting into a code smell.

I believe that we should try to use casting as little as possible. I believe
casting references is something we can design around, and when you do write a
cast, that line of code which performs a cast should read, "*I ran out of
ideas*." There are design patterns, such as the Visitor Pattern, which may
reduce your need for casting. You might reduce the need for casting by using
stronger type information. Think, "Do I really need an `Object`, or should I use
some strong interface?" Regarding a need for designing code with stronger type
information, the type theorist *Philip Wadler* had this to say about `Object`.

{{< rawhtml >}}
<blockquote>
If you see the class Object mentioned in a Java program, it is usually a sign
that the program would benefit from the use of generic types. You might say that
the class is well named — when you see it you should "<strong>object</strong>"
and use generic types instead.
</blockquote>
{{< /rawhtml >}}

*If you like the cut of his jib from that comment, you might like
[this video](https://www.youtube.com/watch?v=NZeDRs6snm0), where he talks about
generics, erasure, and type theory.*

However, we can't always assume the uses of our interfaces will do the right
thing, and so we might decide instead to take the second approach.

### For reasons of safety, copy immutable objects at application boundaries.

So inside of your library code, you might take all of the advantages of your
mutable and immutable objects, but then once you get to some boundary of your
API, you create a copy of your objects to avoid letting users of the API break
things internally. Of course, this is for when you actually apply the pattern.

## Is it really immutable?

The last thing you want to do is to be able to return references to objects
which can change internally, in places where they shouldn't be changing at all.
Every part of the state should operate transitively. So if you have an object
which holds immutable references, those objects held shouldn't change. If you
have to create a copy of a mutable object, you should make it possible to create
a deep copy of the object where needed. In addition to being a multi-threading
concern, this problem can appear in even single-threaded code.

This is a pattern which is designed to tell you when you don't need to create
copies, but it can be misleading. Think about how your objects are used, and
don't return immutable references to mutable objects when it's going to be
possible to write to those objects later, outside of the casting problem
mentioned before.

## The Immutable Interface pattern isn't always useful.

The immutable interface pattern doesn't always make sense. Let us consider two
example objects, one which only makes sense if it's immutable, another which
only makes sense if it's mutable.

For the immutable example, let us consider a `Pair<T, U>` class. These pair
types are *tuples of size 2*, designed to represent the combination of two types
at once. So you construct a pair with two values, and you pass the pair along.
Because our language would allow it, we might create setters for the two
elements of the pairs. However, I would beg the question, why would you ever
want to do such a thing? Tuples are by definition immutable objects. Tuples
collect many values in an immutable sequence, an immutable combination of
values, if you will. There is no reason to modify the values a tuple holds, you
just create another tuple with different values. So for this case, with our pair
class, there's no reason to create an immutable interface. Just write the types
in the constructor, and make the inner private variables `final`.

So now we have an example of something that only makes sense as being immutable,
so what about only mutable objects? The most obvious example, I think, is an
`InputStream`. The purpose of an `InputStream` is that it is an abstraction over
some data. You open up a stream, you read data from it, once, forwards, and you
close the stream when you're done with it. Reading data from an input stream
mutates it, as after you've read a byte from the `InputStream`, you don't see it
again. Unless of course you decide to somehow reset the `InputStream`, which is
again another mutation. Supposing you had an immutable interface for an
`InputStream`, what would you do with it? I struggle to imagine anything
meaningful. The object only makes sense when it's mutable. You don't need to use
the pattern here.

## You don't always want the mutable covariant return types

The mutable covariant return type trick was shown as an example of something
which *could* be useful, under certain circumstances. This isn't always the
case. Consider an object with a mutable variation, perhaps a `Monkey` and you've
got one greedy monkey. Your monkey holds some `Peanut`s, and as all monkeys
know, not every `Peanut` is as big as the last, so the `Peanut`s have a
`getSize` method for retrieving their size, among other attributes, such as the
type of the peanuts. Suppose you have some means of getting the peanuts from
your `MutableMonkey`, which gives you `MutablePeanut`s, which have `setSize`
methods. You will then have the power to change the details of the peanuts the
monkey holds, outside of the careful attention and control of your
`PeanutFactory`. You'll have access to details you shouldn't really have access
to. You really only need to get the immutable `Peanut`s from your `Monkey`s.

So in other words, if you use the covariant return types to give access to inner
mutable objects, you may end up with having some unhappy monkeys. And nobody
wants unhappy monkeys.

## Generic objects cannot be totally covariant

Consider an object `Tool<Widget>` and another object `Tool<MutableWidget>`.
Given a method `Tool<Widget> getTool()` in an interface, it is illegal to write
a method `Tool<MutableWidget> getTool()` as a method override. The reasons for
this are numerous, but we can simply accept that it cannot be done. Thus,
covariant return types will not help you when you have to deal with generic
objects.

There are some ways to get around this.

1. Don't use covariant return types in some cases.
2. Don't use generic objects in some cases.
3. Write immutable wrappers for generic objects.
4. *Write the generic objects themselves with the immutable interface pattern*.

Option 1 states that we should just return the immutable/mutable generic type,
and not worry about it too much. This can be a valid solution in a few cases.
Option 2 states that we should avoid generic objects so we can get this
behaviour. It might be that `Tool` only really makes sense for `Widgets`, so it
really only needs to hold `Widgets`. It might also be the case that `Tool` is
useful for more than one kind of object, but that object either better
represented with an interface, or `Tool` is itself is better represented with an
interface, instead of a generic type parameter. Option 3 tells us that,
supposing `Tool` is specified with an interface, we could write a wrapper class
which makes the mutable method calls illegal at runtime. This isn't great,
because we lose compile time checks, but this is exactly what happens with
`List<E>` and `Collections.unmodifiableList` in the Java standard library.

*You might wonder why the Java standard library doesn't use the immutable
interface pattern for the list types. A vendor for another object oriented
language
[did make this decision](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSArray_Class/NSArray.html).*

Option 4 tells us that we might instead have an immutable `Tool` interface, and
a `MutableTool` concrete class. In this case, then every `MutableTool<T>` which
implements a `Tool<T>` creates the covariance relation we want, and we can
indeed perform the override we want. However, the generic type parameter itself
will still not be covariant, so mileage may vary. It might be the case that you
don't need to modify the `T` inside of the `Tool`, so in that case Option 4
becomes a perfect solution.

## Conclusion

We have looked at common patterns of writing code with mutable objects in Java,
and how these patterns can create code which is harder to understand and more
error-prone. We have examined a design pattern which improves on this, and a
language feature which can aide use of the design pattern in certain
circumstances. We have closed with some words of advice on when these solutions
might fail, and when these solutions might not be useful. Nevertheless, the
Immutable Interface pattern and covariant return types are useful tools which
can help you write better code.

This article makes no discussion of how write software that is heavily protected
against problems like `NullPointerException`s. Perhaps means of avoiding
problems such as those can be discussed in a future article.

Hopefully, after reading this article, you will have gained a few ideas about
how you plan to write your next codebase which may prove useful. Let us forever
be seeking ways to improve ourselves, and therefore better ways to create
software.
