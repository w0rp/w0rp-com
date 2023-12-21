---
title: Vim Script for the JavaScripter
date: 2018-08-22 23:23:00
tags: ["javascript", "vim"]
---

This article provides a quick reference for how to write Vim script for people
who are already familiar with JavaScript. For the sake of brevity, I will refer
to Vim script by another common name, "VimL," throughout the rest of this
article.

If you use Vim as your editor, and want to write your own plugins or just
automate certain tasks, it's worth learning how to write VimL. Vim's own
scripting language is guaranteed to work on every platform that Vim runs on.
This guide is written for Vim 8.0 and above, and also for more recent NeoVim
versions. This article will cover the following topics.

* The basic types VimL supports.
* Basic VimL syntax.
* Logical expressions in VimL.
* Working with Strings, Numbers, Lists, and Dictionaries.
* Type conversion and type checking.
* Basic statements and control flow.
* Writing basic functions in Vim.
* VimL variable scoping rules.

Throughout the following guide, references will be made to relevant sections of
the Vim documentation available via the help system. Type the {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span></code>{{< /rawhtml >}} command in
Vim as provided to view that documentation. You can use the help system to look
up the documentation for any Vim function with {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> function_name()</code>{{< /rawhtml >}}.

## Types

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> variables</code>{{< /rawhtml >}}

The best place to start with any language is with the basic types the language
supports. The basic types you will be familiar with in JavaScript have the
following equivalences in VimL.

JS type     | Vim type
------------|---------
`string`    | `String`
`number`    | `Number` OR `Float`
`boolean`   | `Boolean`
`null`      | `v:null`
`undefined` | *No equivalent*
`Object`    | `Dictionary`
`Array`     | `List`
`function`  | `Funcref`

JavaScript has one type for numbers, but VimL has two. `Number` is the type
for integers, and `Float` is the type for floating point numbers. Floating point
support is optional, but most modern platforms support it.

The `Boolean` type is new in Vim 8.0, and was added to the language primarily to
support JSON serialization, as was the value `v:null`. The newer `Boolean`
values are written with `v:true` and `v:false`. Numbers are usually used for
Boolean logic in VimL instead, so you should prefer to write `1` and `0` instead
of `v:true` and `v:false`.

There's no need for `undefined` in VimL, as accessing missing keys of objects
will result in exceptions being thrown.

Unlike JavaScript, there is no base `Object` type from which other objects like
`Array` and `Function` are derived. There are no classes, though functions
can be bound to `Dictionary` values. A `Funcref` in Vim is a type of variable
which is a reference to a Vim function, which may or may not already be defined.

## Basic Syntax

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> Command-line</code>, <code class="vim highlight">:<span class="hljs-keyword">help</span> let</code>{{< /rawhtml >}}

In VimL, each line of code represents a command, just as you can express with
`:` in normal mode, or in "Ex" mode. ({{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> Ex-mode</code>{{< /rawhtml >}})

Variables can be defined in Vim with the `let` command. You can print
expressions with the `echo` command. You can try the following in Vim from
normal mode.

```vim
:let foo = 'Hello World'
:echo foo
```

You should see the string "Hello World" printed to your echo line. You can save
the lines above exactly as they are in a `.vim` file, and you can execute the
file by using `:source %`, which will execute the current file as VimL code. The
`:` for executing a command is redundant in "Ex" mode, so you can also write
your script like so.

```vim
let foo = 'Hello World'
echo foo
```

The near equivalent in JavaScript would be as follows.

```js
var foo = 'Hello World'
console.log(foo)
```

Because every line in VimL code must be a valid Vim command, function calls must
either be part of an expression or called with the `call` command.

```vim
let x = abs(1)
" You need to write `call` here.
call clearmatches()
```

Any Vim command can be abbreviated to the shortest string for a command name
which is still unique. For example, you can use `:cal` in place of `:call`, as
there's no other command which starts with `:cal`. It is recommended to always
write the full command name for a command in scripts to avoid confusion.

There are far too many Vim commands for this guide to name, but the essential
commands for writing basic scripts will be named throughout this guide.

In JavaScript, logical lines of code are terminated with semicolons (`;`), and
semicolons are automatically inserted in JavaScript code, meaning you don't need
to write semicolons in most cases. In VimL, lines logically end where a line
ends in a file, and to split logical lines over further lines in a file, you
have to continue the line by adding `\` to following lines. For example.

```vim
" Results in 3
let x = 1
\ + 2
```

In Vim, comments are all single-line comments denoted with a single `"`
character and some subsequent text. The following code in Javascript...

```js
// This is a comment.
var x = 42
```

... can be written like so in VimL.

```vim
" This is a comment.
let x = 42
```

Comments cannot be made inside of expressions, say for large Dictionaries.
This will be explained again below.

## Logical expressions

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> expression-syntax</code>{{< /rawhtml >}}

VimL supports the logical operations you might expect, with very similar syntax
in most cases.

JavaScript          | VimL
--------------------|------------
{{< rawhtml >}}<code class="highlight">!<var>x</var></code>{{< /rawhtml >}}                | {{< rawhtml >}}<code class="highlight">!<var>x</var></code>{{< /rawhtml >}}
{{< rawhtml >}}<code class="highlight"><var>x</var> &#124;&#124; <var>y</var></code>{{< /rawhtml >}}  | {{< rawhtml >}}<code class="highlight"><var>x</var> &#124;&#124; <var>y</var></code>{{< /rawhtml >}}
{{< rawhtml >}}<code class="highlight"><var>x</var> && <var>y</var></code>{{< /rawhtml >}}            | {{< rawhtml >}}<code class="highlight"><var>x</var> && <var>y</var></code>{{< /rawhtml >}}
{{< rawhtml >}}<code class="highlight"><var>x</var> &lt; <var>y</var></code>{{< /rawhtml >}}, etc.    | {{< rawhtml >}}<code class="highlight"><var>x</var> &lt; <var>y</var></code>{{< /rawhtml >}}, etc.
{{< rawhtml >}}<code class="highlight"><var>x</var> == <var>y</var></code>{{< /rawhtml >}}           | {{< rawhtml >}}<code class="highlight"><var>x</var> ==# <var>y</var></code>{{< /rawhtml >}}
{{< rawhtml >}}<code class="highlight"><var>x</var> === <var>y</var></code>{{< /rawhtml >}}           | {{< rawhtml >}}<code class="highlight"><var>x</var> is# <var>y</var></code>{{< /rawhtml >}}
{{< rawhtml >}}<code class="highlight"><var>x</var> !== <var>y</var></code>{{< /rawhtml >}}           | {{< rawhtml >}}<code class="highlight"><var>x</var> isnot# <var>y</var></code>{{< /rawhtml >}}
{{< rawhtml >}}<code class="highlight"><var>x</var> ? <var>y</var> : <var>z</var></code>{{< /rawhtml >}}         | {{< rawhtml >}}<code class="highlight"><var>x</var> ? <var>y</var> : <var>z</var></code>{{< /rawhtml >}}

Comparison operators will always result in either `0` or `1`, so you cannot
use expressions like `possiblyNull || {}` in VimL, like you can in JavaScript.

VimL supports both case-sensitive and case-insensitive comparisons for `String`
values, and the behavior of the `==` and `is` operators in Vim is
**configurable**. Because of this, it is advised to always write `==#` and `is#`
when working with `String` values, or `==?` and `is?` instead when you want
to perform a case-insensitive comparison. `x is? y` in VimL is roughly
equivalent to `String(x).toLowerCase() === String(y).toLowerCase()` in
JavaScript.

The `==` operator performs a deep comparison of values for `List` and
`Dictionary` objects, so the result of `{'x': [1, 2]} == {'x': [1, 2]}` is `1`
in VimL, and would be `false` in JavaScript, where the operator has the meaning
of comparing the identity of two objects. `is` in VimL performs a comparison
similar to `===` in JavaScript, and tests for two `Dictionary` or `List` objects
having the same identity.

`==` can result in an exception being thrown for incompatible types, like `List`
and `Number`, so there are fewer "wat" moments with strange comparisons in Vim
than in JavaScript. `is` will never result in an exception being thrown. A rule
of them is to always use `is#` or `is?` for comparisons with strings, always use
`is` for comparisons with numbers, and convert Floats to numbers whenever
possible or vice-versa, and use wither `==#` or `is#` for testing for `List` or
`Dictionary` values.

## String expressions

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> expr-string</code>{{< /rawhtml >}}

There are two different kinds of strings in VimL, "strings" written with double
quotes (`"`) and "literal strings" written with single quotes (`'`).  Unlike
JavaScript, your choice of quotes matters in Vim. Double quote strings support a
number of escape sequences, while single quoted strings do not support any
escape sequences, other than a special way of escaping single quotes by
inserting two single quote characters. (`''`)

{{< rawhtml >}}
<pre><code class="lang-vim highlight hljs"><span class="hljs-comment">" Echoes: \n</span>
<span class="hljs-keyword">echo</span> <span class="hljs-string">'\n'</span>
<span class="hljs-comment">" Echoes a blank line.</span>
<span class="hljs-keyword">echo</span> <span class="hljs-string">"\n"</span>
<span class="hljs-comment">" Both echo: isn't</span>
<span class="hljs-keyword">echo</span> <span class="hljs-string">'isn'</span><span class="hljs-string">'t'</span>
<span class="hljs-keyword">echo</span> <span class="hljs-string">"isn't"</span>
<span class="hljs-comment">" Both echo: \</span>
<span class="hljs-keyword">echo</span> <span class="hljs-string">'\'</span>
<span class="hljs-keyword">echo</span> <span class="hljs-string">"\\"</span>
<span class="hljs-comment">" Echoes the character code for Ctrl+W</span>
<span class="hljs-keyword">echo</span> <span class="hljs-string">"\&lt;C-w&gt;"</span>
</code></pre>
{{< /rawhtml >}}

Here are some essential String operations, and their equivalent forms.

JavaScript                 | VimL
---------------------------|------------
`str.length`                | `len(str)`
`str[i]`                    | `str[i]`
`str[str.length - i]`       | `str[-i]`
`str.slice(i)`              | `str[i:]`
`str.slice(start, end)`     | `str[start : end - 1]`
`str.slice(start, -1)`      | `str[start : -2]`
`str.slice(-2, -1)`         | `str[-2 : -2]`
`str + x`                   | `str . x`
`str.startsWith(x)`         | `str[:len(x) - 1] is# x`
`str.indexOf(x)`            | `stridx(str, x)`
`str.lastIndexOf(x)`        | `strridx(str, x)`
`str.includes(x)`           | `stridx(str, x) >= 0`
{{< rawhtml >}}<code>str.match(x) &#124;&#124; []</code>{{< /rawhtml >}}  | `matchlist(str, x)`
{{< rawhtml >}}<code>(str.match(x) &#124;&#124; [])[0]</code>{{< /rawhtml >}}  | `matchstr(str, x)`
`str.match(x) != null`      | `str =~# x`
`str.match(x) == null`      | `str !~# x`
`str.repeat(x)`             | `repeat(str, x)`
`str.replace('xyz', r)`     | *No direct equivalent*
`str.replace(/xyz/, r)`     | `substitute(str, 'xyz', r, '')`
`str.replace(/xyz/g, r)`    | `substitute(str, 'xyz', r, 'g')`
`str.normalize(x)`          | *No direct equivalent*
`str.trim()`                | *No direct equivalent*

Unlike List index lookups, looking up a index in a String which is out of range
will return an empty String.

Regular expressions in Vim have very different syntax from JavaScript. Regular
expressions require too much discussion to describe in detail here, but
{{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> magic</code>{{< /rawhtml >}} will reveal most of the details you need to know.

## Numeric expressions

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> expr-number</code>{{< /rawhtml >}}

Numeric expressions are similar to what you might expect from JavaScript, and
C-like languages. Numbers can be expressed with a sequence of digits, as
hexadecimal values, as octals, and as binary values. Exponents can be used.
Numbers with a decimal place are interpreted as `Float` values.

```vim
" 42 as a Number
echo 42
" 255 as a Number
echo 0xff
" 63 as a Number
echo 077
" 7 as a Number
echo 0b111
" 1.5 as a Float
echo 1.5
" 100 as a Float
echo 0.1e+3
```

Note that `0 + '077'` will become `63`, but `str2nr('077')` will become `77`.
`str2nr` accepts a second argument for the base of the number, which defaults to
base 10. Because base 10 is what you almost always want for leading zeros, you
should prefer to use `str2nr` for converting `String` values to `Number` values.
Use `str2float` to convert `String` values to `Float` values.

Here are some essential Number/Float operations, and their equivalent forms.

JavaScript          | VimL
--------------------|------------
`+x`                | `+x`
`-x`                | `-x`
`x + y`             | `x + y`
`x - y`             | `x - y`
`x * y`             | `x * y`
`x / y`             | `x / y`
`x ** y`            | `pow(x, y)`
`x & y`             | `and(x, y)`
{{< rawhtml >}}<code>x &#124; y</code>{{< /rawhtml >}} | `or(x, y)`
`x ^ y`             | `xor(x, y)`
`~x`                | `invert(x)`
`x << y`            | *None*
`x >> y`            | *None*
`x >>> y`           | *None*
`Math.max(x, y)`    | `max([x, y])`
`Math.min(x, y)`    | `min([x, y])`
`Math.round(x)`     | `round(x)`
`Math.ceil(x)`      | `ceil(x)`
`Math.floor(x)`     | `floor(x)`
`Math.trunc(x)`     | `trunc(x)`
`Math.sqrt(x)`      | `sqrt(x)`
`Math.exp(x)`       | `exp(x)`
`Math.log(x)`       | `log(x)`
`Math.log10(x)`     | `log10(x)`
`Math.log2(x)`      | `log(x) / log(2)`
`Math.abs(x)`       | `abs(x)`
`Math.acos(x)`      | `acos(x)`
`Math.asin(x)`      | `asin(x)`
`Math.atan(x)`      | `atan(x)`
`Math.atan2(x, y)`  | `atan2(x, y)`
`Math.cos(x)`       | `cos(x)`
`Math.tan(x)`       | `tan(x)`

Note that `1 / 2` will result in `0` as a `Number`. If you want a floating point
result, use a floating point number. `1 / 2.0` will result in `0.5` as a
`Float`.

## List expressions

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> Lists</code>{{< /rawhtml >}}

Lists can be expressed like Arrays in JavaScript. `[` and `]` open and close
lists.

```vim
echo [1, 2, 3]
```

You can continue long lists with the continuation character.

```vim
let x = [
\ 1,
\ 2,
\ 3,
\]
```

Here are some essential List operations, and their equivalent forms.

JavaScript                 | VimL
---------------------------|------------
`list.length`              | `len(list)`
`list[i]`                  | `get(list, i)`
`list[list.length - i]`    | `get(list, -i)`
*No equivalent*            | `list[i]`
*No equivalent*            | `list[-i]`
`list.slice()`             | `copy(list)`
`list.slice(i)`            | `list[i:]`
`list.slice(start, end)`   | `list[start : end - 1]`
`list.slice(start, -1)`    | `list[start : -2]`
`list.slice(-2, -1)`       | `list[-2 : -2]`
`list.slice(0, 1)`         | `list[0 : 0]`
`list.concat(x)`           | `list + x`
`list.push(x)`             | `add(list, x)`
`list.push(...x)`          | `extend(list, x)`
`list.unshift(x)`          | `insert(list, x)`
`list.splice(i, 0, x)`     | `insert(list, i, x)`
`list.splice(i, 1)`        | `remove(list, i)`
`list.splice(i, 2)`        | `remove(list, i, i + 1)`
`list.splice(i, 0, x, y)`  | `extend(list, [x, y], i)`
`list.pop()`               | `remove(list, -1)`
`list.indexOf(x)`          | `index(list, x)`
`list.indexOf(x, i)`       | `index(list, x, i)`
`list.includes(x)`         | `index(list, x) >= 0`
`list.join(x)`             | `join(list, x)`
`list.reverse()`           | `reverse(list)`
`list.sort()`              | `sort(list)`
`list.sort(CmpFunc)`       | `sort(list, CmpFunc)`
*No direct equivalent*     | `uniq(list)`
*No direct equivalent*     | `uniq(list, CmpFunc)`
*No direct equivalent*     | `list1 == list2`
`list1 === list2`          | `list1 is list2`

You can get items at index `i` like in Javascript with `list[i]`. Unlike
JavaScript, accessing an undefined or invalid index for a List results in an
exception being thrown. You can get an item at possibly undefined index or
a default value with `get(list, i, default)`. The default value for `default`
itself is `0`.

Lists can be sliced with a slice operator `[start : end]`. Unlike `.slice()` in
JavaScript, `end` specifies the index to **end a slice at**, not the index
**before** the end of a slice.

Note that the result of `remove()` on a List with one index is the removed item
in Vim, but with two index values the result is a List with the items. This
is consistent with the behavior of the same function for `Dictionary` values,
as you will see in the next section.

You can also perform a lowercase index lookup for strings too with
`index(list, x, i, 1)`, which is roughly equivalent to
`list.map(y => y.toLowerCase()).indexOf(x.toLowerCase(), i)` in JavaScript.

VimL provides one essential operation for Lists which JavaScript does not
provide directly, and that is the `uniq()` function. `uniq()` removes duplicate
entries from an already sorted list, with an optional comparison function just
like the function which can be given to `sort()`. A copied de-duplicated list
with a comparison function can thus be computed like so.

```vim
uniq(sort(copy(list), function('CmpFunc')), function('CmpFunc'))
```

## Dictionary expressions

`Dictionary` values are like basic objects in JavaScript. One important
difference in the syntax is that unlike JavaScript, keys must always be quoted.
The following two examples are equivalent.

```js
var some_string = 'z'
// An ES6 computed key is used here.
// {'x': 1, 'y': 2, 'z': 3}
var obj = {x: 1, 'y': 2, [some_string]: 3}
```

```vim
let some_string = 'z'
" {'x': 1, 'y': 2, 'z': 3}
let obj = {'x': 1, 'y': 2, some_string: 3}
```

Like JavaScript objects, Dictionary keys can only be String values.

Here are some essential Dictionary operations, and their equivalent forms.

JavaScript                  | VimL
----------------------------|------------
`obj.xyz`                   | `obj.xyz`
`obj.xyz = value`           | `let obj.xyz = value`
`obj[key]`                  | `get(obj, key)`
*No equivalent*             | `obj[key]`
`obj[key] = value`          | `let obj[key] = value`
`key in obj`                | `has_key(obj, key)`
`delete obj1.xyz`           | `call remove(obj1, 'xyz')` *(Can throw errors)*
`delete obj1[key]`          | `call remove(obj1, key)` *(Can throw errors)*
`Object.keys(obj)`          | `keys(obj)`
`Object.keys(obj).length`   | `len(obj)`
`Object.values(obj)`        | `values(obj)`
`Object.entries(obj)`       | `items(obj)`
`Object.assign(obj1, obj2)` | `extend(obj1, obj2)`
`Object.freeze(obj)`        | *No equivalent*
`Object.seal(obj)`          | *No equivalent*
*No direct equivalent*        | `obj1 == obj2`
`obj1 === obj2`             | `obj1 is obj2`

Removing a key which does not exist in a Dictionary in VimL will result in an
error, whereas in JavaScript the operation will fail silently.

There are no equivalents for `Object.freeze`, `Object.seal`, or
`Object.preventExtensions` in VimL, but you can use the `lockvar` command to
temporarily prevent a Dictionary from being modified.

## Type conversion

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> str2nr</code>, <code class="vim highlight">:<span class="hljs-keyword">help</span> str2float</code>, <code class="vim highlight">:<span class="hljs-keyword">help</span> string()</code>{{< /rawhtml >}}

There are a few ways to convert between types in VimL, but the following
methods are recommended for converting between types.

Types                 | Syntax
----------------------|---------
`String` -> `Number`  | `str2nr(x)`
`String` -> `Float`   | `str2float(x)`
`Float` -> `Number`   | `float2nr(x)`, `float2nr(ceil(x))`, `float2nr(floor(x))`
`Number` -> `Float`   | `floor(x)`
`Number` -> `String`  | `string(x)`
`Float` -> `String`   | `string(x)`
`Boolean` -> `Number` | `+x`
`Number` -> `Boolean` | `x ? v:true : v:false`

## Type checking

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> type()</code>, <code class="vim highlight">:<span class="hljs-keyword">help</span> v:t_TYPE</code>{{< /rawhtml >}}

For performing type checking in Vim 8.0 and onwards, use the `type()` function
and `v:t_` constants for types. `v:t_` variables do no exist in Vim versions
below Vim 8.0, where you can use `type()` again with an example value instead.
See the following table.

Type                 | Expression
---------------------|------------
`String`             | `type(x) is v:t_string`
`Number`             | `type(x) is v:t_number`
`Float`              | `type(x) is v:t_float`
`Dictionary`         | `type(x) is v:t_dict`
`List`               | `type(x) is v:t_list`
`Funcref`            | `type(x) is v:t_func`
`Boolean`            | `type(x) is v:t_bool`
`v:null`             | `x is v:null`

The following table provides some examples of how to compare values with unknown
types with some values with known types. It is not safe to use `==` for
comparing any two values, as errors can be raised for incompatible values.

Types                    | Example
-------------------------|------------
? == `String`            | `x is# 'foo'`
? == `Number`            | `x is 42`
? == `Float`             | `x is 42.0`
? == `Dictionary`        | `type(x) is v:t_dict && x ==# {'x': 'y'}`
? == `List`              | `type(x) is v:t_list && x ==# [1, 2]`
? == `Funcref`           | `x is function('type')`
? == `Boolean`           | `x is v:true` or `x is v:false`
? == `v:null`            | `x is v:null`

## Basic Statements

Now you have all of the types and operators in mind, it's time to discuss
statements which form the basic building blocks of any programming language.
Equivalent statements are listed below.

### Conditions

An if statement written like so in JavaScript...

```js
if (cond1) {
  // expr1
} else if (cond2) {
  // expr2
} else {
  // expr3
}
```

... can be written like so in VimL.

```vim
if cond1
  " command1
elseif cond2
  " command2
else
  " command3
endif
```

There are no `switch` statements in VimL.

All values for conditions in Vim are first converted to `Number` values, so
`List` and `Dictionary` objects are not valid values for conditions, as they
cannot be converted to numbers.

### Loops

VimL supports `while` loops like JavaScript. The following loop in JavaScript...

```js
while (cond) {
  // expr
}
```

... can be written like so in VimL.

```vim
while cond
  " command
endwhile
```

There is no `do ... while` loop in VimL.

The VimL `for` loops loop over each element of a `List`. A classic JavaScript
for loop like so...

```js
for (var index = 0; index < length; index++) {
  // expr
}
```

... can be written like so in VimL.

```vim
for index in range(length)
  " command
endfor
```

A JavaScript `for ... of` loop written like so...

```js
for (var variable of iterable) {
  // expr
}
```

... can be written like so in VimL.

```vim
for variable in iterable
  " command
endfor
```

You can use the commands `continue` and `break` like you might expect in
JavaScript for all loops.

### Exception handling

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> :try</code>, <code class="vim highlight">:<span class="hljs-keyword">help</span> throw-variables</code>{{< /rawhtml >}}

VimL supports `try ... catch` somewhat similar to JavaScript, with some
important differences. In VimL, all exceptions are simply `String` values,
and the `catch` command supports regular expressions for looking for errors
that match the regular expression. You can throw an error as a `String` with
the `throw` command.

```vim
try
  " Throw an error.
  throw 'xxx foo xxx'
" Catch all errors with a message containing 'foo'
catch /foo/
  call HandleException()
" finally is optional
finally
  call AlwaysDoSomethingElse()
endtry
```

When an exception is thrown, the variable `v:exception` will be set to the
exception's message, and `v:throwpoint` will be set describing where an
exception was thrown from.

## Functions

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> function</code>, <code class="vim highlight">:<span class="hljs-keyword">help</span> funcref()</code>, <code class="vim highlight">:<span class="hljs-keyword">help</span> lambda</code>{{< /rawhtml >}}

A JavaScript function like so...

```js
function foo() {
  return 42
}
```

... can be defined like so in VimL.

```vim
function! Foo() abort
  return 42
endfunction
```

The `!` option for the function command is referred to as a "bang," which is
special syntax supported by some commands, with a different meaning for each
command. In the case of the `function` command, it means that any current
function with the name `Foo` should be replaced with the function being defined.
Without `!`, Vim will raise an error about the function already being defined.

The `abort` keyword for a function causes a function to exit on the first
command where an error is encountered. It is recommended to use the `abort`
keyword for all functions. Otherwise, Vim will continue to execute lines of code
in a function after an error is encountered, and *strange things* will happen.

Note that all function names **must** begin with a capital letter in VimL. This
prevents users from being able to redefine standard Vim functions.

You can reference functions directly in JavaScript...

```js
var func = foo
```

In VimL you have to create a `Funcref` value with the `function()` or
`funcref()` functions.

```vim
" The variable again has to start with a capital letter.
let Func = function('Foo')
" Another way to reference a function.
let Func2 = funcref('Foo')
```

`function()` and `funcref()` are slightly different. `function('Foo')` looks for
the `Foo` function by name, so the reference will change if `Foo` is redefined.
`funcref('Foo')` gets a reference to an existing function, and the reference
will not change if `Foo` is redefined.

Functions can also be defined with a `s:` prefix for defining functions only
for use in a particular script.

```vim
" This function can only be called in the current script.
function! s:Foo() abort
  return 42
endfunction
```

## Variable scope

*Relevant help:* {{< rawhtml >}}<code class="vim highlight">:<span class="hljs-keyword">help</span> internal-variables</code>{{< /rawhtml >}}

Variables in Vim can be set in various scopes. Variables are either scoped
to the global scope or to a function by default. It is recommended to always
state the scope of a variable explicitly, and the scope of a variable is
sometimes required. All variables will have their scope explicitly set
throughout the rest of this guide.

Scopes for variables are like so.

Scope | Explanation
------|------------
`g:x` | `x` in the global scope.
`l:x` | `x` in the local scope.
`a:x` | Function argument `x`. Read-only.
`s:x` | `x` in the script's scope. Only accessible in the script.
`v:x` | A read-only special Vim variable `x`.
`b:x` | `x` in the current buffer.
`w:x` | `x` in the current window.
`t:x` | `x` in the current tab.

`b:`, `w:`, and `t:` variables are variables assigned to the scope of the
buffer, window, or tab. These scopes can be used for associating arbitrary
values with buffers, windows, or tabs. Vim never falls back on variables in one
scope after failing to find them in another.

Every variable scope is also itself a VimL variable, as a `Dictionary` value.
Therefore all `Dictionary` operations are valid for those variables. For
example, `g:['x']` and `g:x` are equivalent. `get(g:, 'x', default)` can be used
to get a variable or a default. The following restrictions apply.

1. Keys must also be valid variable names. `let g:['a b'] = 'c'` is illegal.
2. Read-only variables cannot be modified.
3. `Funcref` keys must start with a capital letter.

Functions must reference their arguments as `a:x`, and not `x`.

```vim
function! Foo(x) abort
  " Incorrect, `x` is equivalent to `g:x` here.
  return x * 2
endfunction

" OK
function! Foo(x) abort
  return a:x * 2
endfunction
```

## All for now

Having read this article, you should now be familiar with all of the types of
values in VimL, and the basic operations on those types. You should now be
familiar with basic syntax and semantics in VimL. You should have a basic
understanding of Vim scoping rules, and functions.

If you have been using Vim as your text editor for a while and writing
JavaScript code, you might not have been familiar with the expressive power of
VimL code. Many core concepts in JavaScript also appear in VimL, and the breadth
of what can be accomplished in VimL might stretch further than you had
previously imagined.

There is much, much more to discuss about VimL, so expect further articles to be
written at some point in the future. Important topics not discussed here include
defining custom commands, `autoload` functions, `autocmd` events, mapping keys
to custom functions, asynchronous programming similar to JavaScript's execution
model, and much, much more. Look forward to more articles in the future, and I
hope you had fun reading this.
