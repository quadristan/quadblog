---
title: Your backlog called. It wants you to deal with all the issues, now!
date: 2024-05-08T21:33:21.070Z
author: Tristan Parisot
tags:
  - Project management
  - Agile
---

Focus is key for agile practices. You set sprint goals, and skip whatever is not
in this focus. Teams working in agile, by essence, create todos, items, tasks, which
ends up in the backlog.

The monster get bigger over time, and at some point it becomes _unmanaged_. What to do when
you reach this stage, and how can you prevent it from happening again?

In this blog post, we will try to get to a better place, and we will see the impact of the paradox of _project_ vs _product_

<!-- more -->

## Why things end up in the backlog in the first place?

In your team, you probably have someone with a role like product owner/product manager

But in your team, do you have someone spending at least 50% of their time, looking at a set of features, check their health, check what can be changed/removed? When they prepare new feature, do they also care of the associated maintanance cost? If not, maybe your product owner is more of a project owner.

Projects typically are one of "Release new feature X" or "change feature Y to support use-case Z". Such organisation often pushes your PO into creating roadmaps with theme-focused time slots.
Everything that does not fit these timeslots because of mismatching theme, or lack of time ends up feeding the backlog monster

## The three types of backlog items

Before we deal with the backlog, let's list the different types of backlog items

<center>

| Type          | Example                                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bug           | Do I need to explain them? I will just say that some companies use the term _"technical fact"_ to stay neutral about the quality of the product.                                                                                 |
| Debt          | Could be product debt _"feature X and Y are too similar yet different, users get confused and it's difficult to onboard customer support on them"_ , or technical debt _"this component uses the legacy stack we cant maintain"_ |
| Opportunities | Something will happen, we can leverage it to improve our velocity. Opportunities can be managed as debt because missed opportunities are debts.                                                                                  |

</center>

## The phallacy of the added value of tickets in the backlog

It is difficult to let go of something, especially something you or your team made.
But let's be reasonable here. How many unsorted backlog tickets does your
jira/gitlab/github has? 10? 100? 1000?
Imagine you have to spend 6 minutes per ticket to complete and sort it out.
Do you think you will ever have the time to do that for all tickets?

There is a simple way to ease up your team life: clear it!

Try to divide by 10 your backlog size by removing the oldest tickets.
If you have the fear of missing out things like I do, you can always move them to a separate board/epic.
Wait and observe, I am pretty sure that after a couple of weeks, no one will miss the tickets.

<center>

| Ticket type | Reason to remove it                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Bug         | A bug lost in the backlog means no one cares about it. Meaning, maybe it is a de-facto feature. |
| Debt        | People working on the feature/code know the usual issues it has.                                |

</center>

Repeat the operation, until your backlog reaches a manageable size, small enough for you to have the time to
look and care about all the tickets.

Having too much backlog tickets is a double waste of time: you will never
have time to look at them all and on top of that, everytime you open the board, you see them,
and you get distracted just by looking at them.

## How to prevent the monster from being unmanaged?

When something out of the sprint focus appears, you have 3 possibilities:

### Do it now. And rework your DOD

> oops, we didnt think about adding tests in this sprint. Let's add this in the backlog

This above, is the paradox of _product_ versus _project_.
Most organisations want their feature being delivered and sometimes forget about
the bigger picture: the product. Maintenance belongs to the product while right now
your sprint belongs to the project.

To solve that, make sure that a proper _definition of done_ is agreed between the stakeholders of the product,
and the stakeholders of the project.

Once you have that, your tests should end up in the DoD, therefore they will be in the sprint focus
while developing the features

If a DoD is hard to sell because it looks like this is slowing down the delivery, make an internal one.
Try to do the delivery tasks at the end.

To make an analogy with restaurant world: clean the kitchen worktop before serving the dishes.
Ideally, you'd also need "cooldown" sprints or timeslots, focused on product rather than project.

I suggest leveraging the fact you have just worked on a feature to give time to your Product Owner
to check on the features that are close to this one, to check if there is some product debt to be solved.

It is a bit far-fetched, but if you are working on a temporary feature which removal is already scheduled,
you may consider that it does not require maintenance therefore you could skip adding tests.
But remember, nothing is temporary unless its deletion is already scheduled.

### Slide it on the next project

If you can't do the task now, because of dependencies or time constraints, move this task to
the next project or the one after, which feature or tech stack is similar to those of the task.
If you have cooldown sprints, they are an ideal opportunity.
Make sure that this project schedule exists.

### Forget about it

If you can't do it now, and you don't see it done in a reasonable future, the best is to forget about it.

Forgetting about doing something is not trivial.
When not doing the thing has consequences, you should write them down, and inform whoever is impacted.
Having a page "we decided not do do X because Y" is more interesting than a
task "do X" sleeping in your backlog.

## Conclusion: less is better

In term of backlog, I highly recommend to trim it down. What I personally do is to sort out
all technical backlog items and regroup them into features/stack.
And when it gets too complex,I squash some tickets together.
If you do not know when you will be working on something,
you should keep these tickets as much flexible as possible.
