---
title: The lesson DNA sequencers teach to strings types
date: 2024-02-12T20:38:03.535Z
author: Tristan Parisot
tags:
  - Best Practices
  - Data structures
---

Strings have existed in computer science since its beginning. Defined as a
sequence of symbols in
[Wikipedia](<https://en.wikipedia.org/wiki/String_(computer_science)>), they
govern any data wired down.

Did you know, that due to a famous software handling _almost_ everything as a
string, scientists had to rename their discoveries?

<!-- more -->

## Anything is data. Or seems to be.

I started being a tech lead with this strict guideline:

> Dont suffix a name with `-data`. Anything is data. Drop this suffix.

As usual, when there is an issue with naming something, it often means something
is wrong. The [DKIW pyramid](https://en.wikipedia.org/wiki/DIKW_pyramid)
classifies data as facts, measurements, or representations of observations.

So, I adjusted my guideline:

> If you suffix _something_ with `-data`, you're expressing your intent that you
> do not care about interpreting said _thing_. It's opaque!

Strings can be either a _datum_, a _piece of information_, or even a _knowledge_

<center>

| Level       | Def                                                 | Example                                                                   |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| Wisdom      | Brings value by answering a why/ _what do_ question | Instructions given to the users that grants them ability to open the file |
| Knowledge   | Something aquired by cross-referencing informations | The list of users names who can access the file                           |
| Information | A description/interpretation of facts               | The size of the file described to a human                                 |
| Data        | A fact                                              | File contents that needs to be written to disk                            |

</center>

With this classification, you will see that you're forced to think about the
value of your product. Your company responds to societal needs. These needs
create problems in your users' lives. You will design applications to help these
users inside use-cases.

In DDD terms, try to have the wisdom in the center of your domain, and try to
have the lesser level (data, information) almost out of it.

<center>

| Level         | Space          | Example                                   | Recommended level for handled _things_ |
| ------------- | -------------- | ----------------------------------------- | -------------------------------------- |
| Societal need | Problem space  | Humans need to take care of their health  | Wisdom                                 |
| Problem       | Problem space  | There is not enough GP doctors            | Knowledge                              |
| Use-case      | Solution space | As a patient, I want to find a GP near me | Information                            |
| Service       | Solution space | locate-medical-centers(position,range)    | Data                                   |

</center>

Avoid having to handle Information and Data within the `Problem space`: if you
want to improve your problem space, ask your business intelligence analyst to
give you wisdom/knowledge from these.

As usual, you should make sure that your specific application layers do not
depend on generic concepts. You can, however, make a service depend on a
specific knowledge or wisdom!

## From data to strings

Okay, enough about data already! Pull me some strings!

Strings can be either level on the DIKW framework. As a tech lead of your team,
your role is to make sure that the product value is structuring your software.

Since the definition of string is `a sequence of symbols`, you will see that it
overlaps with some data structures such as `ArrayBuffer`, `Uint8Arrays`,
`std::string` not forgetting `const char*` nor F#/C# `Span<>`. Devs have the
embarrassment of suffering the necessity of choosing amongst this.

> What is the intent? Do you want your _thing_ to be a fact, or something which
> interpretation brings value?

Let's start with a story from the world of genetics

### Scientists had to rename some genes...because of Excel

Giving names to things is a difficult process. In the case of genetics, well, if
you have a gene called _**M**embrane **A**ssociated **R**ing-**CH**-Type **1**_, what short name
would you give to it? Imagine typing it into Excel. You probably thought the
same name that the
[HGCN](https://en.wikipedia.org/wiki/HUGO_Gene_Nomenclature_Committee) did.

There are plenty of `incorrectly assuming something is a date` memes around, I
will let you google them, But this has impacted DNA studies and
[people have made workarounds](https://www.nature.com/articles/s41598-022-17104-3).

So, what is the issue? What is the link between Excel cells, strings and data? A
question of _level_ and _intent_.

On which DIKW level do you think a cell is? Well... All of them!

### Make sure the architecture enforces product intent

As a tech lead, your role is to ensure the safety of your architecture. To do
that, you will probably use tools such as compilers/transpilers, and
type-checking mechanisms. Leverage them. Acknowledge the fact that, like
scientists, there will be mistakes made. Someone will forget to add quotes
around `"March1"` and the system will silently explode.

## Usual data-types to represent sequential data

- He said _data_ types!
- Yes, I did! Using data in `data types` is fine because, in the concept of this
  description, their content itself does not matter. If I start thinking about
  the content, it becomes a value object or an entity.

| Use-case                                            | Type of sequence | Ex of type                                              | Notes                                                                                                                                                                                                        |
| --------------------------------------------------- | ---------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Handling (getting,displaying) user text input       | characters       | `string`, `std::string`                                 | Consider the user ability to write anything from their keyboard. Including emojis or kanjis.                                                                                                                 |
| Handling (receiving, sending) binary data           | bytes/integers   | `ArrayBuffer`, rust `Box<[u8]>`, c# `char[]`, c `char*` | Consider here that the data may not be printable. It can be full of zeros or things without unicode representation                                                                                           |
| Handling (receiving, sending) binary data over text | characters       | Binary encoding such as base N inside a `string`        | The most famous base transformation is `base64`. It allows a textual representation of a buffer. Another famous representation is the `base16` aka [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal). |

### Binary sequences

A long time ago at my university, I used C `char *` to handle strings. This
worked well because, at the time, we mostly used
[ASCII](https://en.wikipedia.org/wiki/ASCII) encoding, with the
[ISO-8859-1](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) one, famous in
France. I coded algorithms such as

```c
const char *findWordAfterComma(const char *input)
{
    for (const char *p = input; *p; p++)
    {
        if (*p == ',')
        {
            return p + 1;
        }
    }
    return NULL;
}

// print to screen
write(0, findWordAfterComma("hello,world"));
```

If you do not see the issue here, well... it's assuming that every single
character takes one byte. Do not do this. Modern strings are encoded in memory,
it can be using UTF-8, UTF-16, or other formats.
Experiment this:

```ts
console.log("🤓".length);
console.log("你好".length);
console.log(new TextEncoder().encode("你好").length);
```

You will notice that some character sequences have different length if you represent them in strings, or in binary encoded forms.

## The lesson of the story

> Strings are for things you want to display. not for binary data.
>
> If you call something data, do not handle its content!
