---
title: "\"You Can't Do That!\" Says Who?"
date: 2014-07-18 17:00:00
tags: ["django", "hacks", "python"]
---

I watched [a talk](https://archive.org/details/dconf2014-day03-talk03)
by a good programmer recently, Adam D. Ruppe. In the talk, Adam had
this to say.

{{< rawhtml >}}
<blockquote>
<p>
There [are] people who ask questions, "What happens if I do this?" [...] Well, my philosophy is to just do it.
</p>
<cite>&mdash; Adam D. Ruppe, D Hacker</cite>
</blockquote>
{{< /rawhtml >}}

I came to a problem at work where I had a filter for a region for lists of
articles, and I wanted to get the same query, only where the filter for the
region was reversed, so I could show "around the world" news on the site. So I
thought to myself,
{{< rawhtml >}}<q>It would save me so, so much time if I could simply copy
and edit the QuerySet in Django, with the filter inverted.</q>{{< /rawhtml >}}
Searching on Google gave me answers
[like this](https://stackoverflow.com/questions/5220433/how-to-edit-filters-list-of-a-queryset/5223423#5223423).

{{< rawhtml >}}
<blockquote>
<p>
<strong>Short answer:</strong> No, you <em>cannot</em> do that.
</p>
<cite>&mdash; Shawn Chin, answering a question on Stack Overflow</cite>
</blockquote>
{{< /rawhtml >}}

The author of the reply goes on to explain that at some point the implementation
of Django's Query object can change, and so you that will break your code. Of
course, at this point I thought,
{{< rawhtml >}}<q><strong>So?</strong> What's your point?</q>{{< /rawhtml >}}
Because changing my code constantly is my job. It's all intentionally written to
be small and replaceable, potentially ready for outright deletion.

So I sat out to implement something which poked through Django QuerySets, found
the filter I was interested in, and replaced it with the negation of that
filter. After about an hour of reading the Django code on GitHub, I produced
this function.

```python
def negate_filter(queryset, field_name):
    """
    Given a queryset object and a field name,
    negate any filters set for that field.
    """
    from collections import deque

    queryset = queryset._clone()

    where_deque = deque([(None, [queryset.query.where])])

    while where_deque:
        parent, child_list = where_deque.popleft()

        for index, node in enumerate(child_list):
            if hasattr(node, "children"):
                if node.children:
                    where_deque.append((node, node.children))
            elif node[0].field.attname == field_name:
                # Create a new node wrapping the filter in its negation.
                new_node = queryset.query.where_class()
                new_node.negated = True
                new_node.children.append(node)

                if parent is not None:
                    # Replace the previous node with our new node.
                    parent.children[index] = new_node
                else:
                    # Set the new node directly on the query, as there
                    # is no parent node.
                    queryset.query.where = new_node

    return queryset
```

It pokes through the Query tree, finds the node where the field name matches,
and wraps that node in a where clause node which negates its contents.

`x = 'y'` becomes `NOT(x = 'y')`, etc.

With this in place, I could now tack on a method to the QuerySet class set for
my Manager class used in my Article objects.

```python
    def with_negated_region_filter(self):
        """
        Return a copy of the queryset with all of its filters and such, only
        with the target region filter negated, if there is one.
        """
        return negate_filter(self, "target_region")
```

Now in my Django templates, I can write something like this.

```django
{% with around_the_world_articles=articles.with_negated_region_filter|slice:"0:5" %}
  {% include "includes/around-the-world-list.html" %}
{% endwith %}
```

**Violà!** Now whichever page I'm on for articles, because none of them include
the slicing for pagination at the time `articles` is accessed, I can drop in the
'around the world' list. I get all of the other filters, the deferred columns,
etc. Because I could do that, I was able to fulfill a seemingly pretty strong
feature request in about half of a day.

The lesson here is, don't be afraid to hack something together if it's small and
easy to understand. if it's small and replaceable, and you run into any problems
later, than you can surely fix those problems quickly. If your hack is easy to
understand and saves you more time than you would have taken otherwise, then
it's a win-win. The more important part of this lesson is that you shouldn't be
*afraid* to do something.

Ever think of a sensible idea and think to yourself,
{{< rawhtml >}}<q>Can I do this?</q>{{< /rawhtml >}}
The answer is almost always **yes**. *Try it.*
