---
title: "Spinning Up"
date: "2025-06-09"
excerpt: "Some stories, some advice."
---

First blog post yay :D

# Spinning Up in life:

One of my least favorite things to happen to tech is this robotic, blueprint-style culture where everyone does the same thing _solely_ because someone else is doing it. A few years ago the "trend" was join FAANG/(other big tech company here) and be revered as the GOAT. Now it's "screw FAANG, if you work in FAANG you're a corporate slave, drop out of college and join YC instead!" The obvious better advice here is somewhere in the middle: more people who end up at FAANG should try their own thing, and more startup founders should maybe stick to the SWE job. This is all a very long winded intro just to say that contrarily to all of this, one of my favorite things to happen to tech (and the bay area) is the (overused) saying that _"you can just do things."_

Everyone should be a believer in this concept, but I think it's pretty one-dimensional to think about it solely from the aspect of academia or your career. You _can_ just do things, but that means you can do *anything*, and I think we should return to that less edgy, more optimistic configuration of the saying.

Over the past three months, I've learned what an LLM is/how they work, joined a combinatorics research group learning about infinite shellability and other crazy math subjects, joined an AI research lab at my school (probably tangential to the fact that I spent literally every office hour pestering my teacher about LLMs), and started venturing further into Mechanistic Interpretability.

To contrast, three months ago, I was probably in my dorm, procrastinating working on my databases project, scrolling, and pretending that a 3 blue 1 brown video was all I needed to understand how any of this works.

The literal point here is that I did _anything._  The implied point here is that **you should too.**

# Spinning Up in college (for the first time)

(This specific portion is more aimed at any high schoolers who might for some reason read this)

College reminds you why you picked your major, and swiftly reminds those who chose said major for the money that they're about to spend their _entire life_ doing this, and should probably switch if they don't like that.

I'm coming out of my freshman year at Northeastern University right now. I attended my first three (incl. summer) semesters at their Oakland campus. Safe to say it was the best decision I could've made. Why?
- **no beauracracy**: starting clubs was easy, starting organizations required just connections and a willingness to start something.
- **no (meaningless/stressful) competition**: the campus has super smart people, but its size means that you don't necessarily have to worry about not being able to join a club or student org.
- **tight knit community**: everyone knows everyone, (or most people know most people). 

These three factors in a school full of ambitious freshman students = the perfect recipe for curiosity, companionship, and most importantly, __collaboration__.

I say all of this to **1)** convince more students that going to (well-supported) satellite campuses and study-abroad programs are increasingly more important. Northeastern focuses on these programs heavily [for a reason](). **2)** that, especially in tech, the vibes of the place you choose to study matter _so, so much more than almost every other factor_ (besides quality of actual education).

# Spinning Up in mechanistic interpretability

an actual, comprehensive guide, in a suggested order. (from scratch)


Before reading any of this, remember that the end goal of these steps is not to _finish the step_, it's to learn. Spend hours/days/weeks on a specific subject until you understand it. These are fundamentals you learn for the love of the game.


1) **[3blue1brown's AI playlist]()**: Watch the whole thing in a pretty relaxed manner. This is just the effective intro, so don't worry about writing everything down. Just get a grasp for the visualizations of the concepts. It helps to be able to do this later down the line.

2) **[Andrej Karpathy's Zero-To-Hero series]()**: Watch the whole thing, do all of the exercises, and most importantly, **try to wrap your head around the papers he mentions. This is what gave me the skills to even understand hard to read ML papers/textbooks.**


3) After you've understood what it takes to make an LLM, play around a little bit. Recreate some papers (write an open source model from the paper alone, implement features proposed by popular researchers, etc.)

### Time for the mech interp stuff!

4) **[Neel Nanda's Dynalist]()**: Ignore any claims of outdatedness. Read the whole thing, in depth. Understand everything you possibly can. This is also a super helpful glossary to look back on when you first get started and you're trying to keep the information in your brain.

5) **[Anthropic's Transformer Circuits Thread]()**: Specifically: "[A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html)" & "[Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html)". These are super fundamental to the current field, and Neel has great walkthroughs of both of them (though admittedly his walkthrough of _"Toy Models"_ has much better production than the other).


### Why share this info?

Well one, anyone can and should do this. Understanding how models actually work seems like something one would (responsibly) do in a world where these models have a fundamental influence on our lives.

I also share (and follow) the sentiments of Anthropic CEO, Dario Amodei. AGI is (probably) coming, and if not AGI, we will still see very very powerful models in our lifetime. It on the echelon of species-level importance that we get AI right. Mechanistic Interpretability is a way to be involved with aligning these models to work with us rather than against.

If you don't buy this/care, shame on you! But there's still a good reason to care about alignment mechanistically: *stability.* Companies want **stable** models that hallucinate less and adhere to the system prompt. The more we get good at aligning these models from the _inside_, the more we get to see them less of creatures on a leash and more as programs we can control (see [Goodfire raising a 50m series A fund for building real software with mechanistic interpretability as the foundation]()). 
