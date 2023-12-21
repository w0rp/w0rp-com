---
title: A Quick, but Important Improvement for Your Java Code
date: 2013-02-19 22:28:00
tags: ["java"]
---

Dear all Java Developers, please stop doing this.

```java
public void List<MyObject> getValues() {
    return new ArrayList(privateList);
}
```

Please start doing this instead.

```java
public void Collection<MyObject> getValues() {
    return Collections.unmodifiableCollection(privateList);
}
```

Here are the reasons why.

1. Both List and Set are sub-interfaces of Collection, so both work. Forward
   ranges are better than random access ranges in most cases.
2. You will cut your memory usage by more than half for any object which has a
   method like this.
3. The resulting collection is immutable (though not transitively), so the
   return value cannot modify the collection you passed.
4. You'll get an added guarantee that when passed down through several
   functions, the collection will be the same as when it was at the top.
