---
title: 'Central Limit Theorem: How I made the programme'
date: '2015-06-02'
author: 'MangleKuo'
---


**This post is an explanation for [this page](../maths/clt.php). If you haven't seen it in work, please go and try it now!**

## Introduction

The web page you may or may not have just visited is a programme I wrote to demonstrate one part of central limit theorem. Basically, it states that, the distribution of the sample mean of large number of samples taken from a population can be approximate into a Normal Distribution. It might sounds a bit complicated but don't worry this post is here to help with that!

To be honest personally I don't really understand everything about central limit theorem since I'm not doing course related to it, but some of the results it predicts are fun. If you are studying it and know more about it than me, I hope this is going to help you understand it better. If you don't know anything about it - I'll try my best to tell you everything I know!

To read more about Central Limit Theorem on \[Wikipedia\], click [here](http://en.wikipedia.org/wiki/Central_limit_theorem).

## Planning

#### What I want to achieve

User should be able to:

+ Input the population values (X)
+ Set the frequency of each X
+ Set the sample size

The programme will

+ List all the possible samples
+ Calculate the mean of each sample
+ Count the frequency of each possible values of sample mean, hence find out the probability
+ Calculate the Expecting Value and Variance of the distribution which we previously find out

#### If you don't understand above, read below:

If you have a bag full of balls, each ball with a number written on it, **"input the population values"** means to set the possible numbers on the balls, **"Set the frequency of each X"** means set how many ball you want each number to have, and **"Set the sample size"** means when we take balls out of the bag, how many balls we'd like to take each times.

![input 1](/images/central-limit-theorem/input_1.jpg){.right}

For example if we set the population values to be {1, 2}, then set the frequency to be {2, 1} respectively, we'll get a population like this:

`1` `1` `2`

Now we can set the sample size to 2, which means we'll take two randomly out of the population each time. 

Notice that because we have two `1` and one `2`, the probability for us to get `1` is \[{2 \over 3}\], and the probability for us to get `2` will therefore be \[{1 \over 3}\]. (Total probability must add up to 1)

In order to run through all the possible sample we can get when we pick our sample from our population, we need to set a certain type of rule. In this case, our rule can be represented by a tree-diagram:

![Tree Diagram](/images/central-limit-theorem/tree_diagram.jpg){.left} 







