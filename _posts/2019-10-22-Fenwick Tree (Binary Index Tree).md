---
title: Understanding Fenwick Trees (Binary Indexed Trees)
date: 2019-10-22 10:10:10 +0800
categories: [Computer Science, Data Structures]
tags: [fenwick-tree, binary-indexed-tree, algorithms]
math: true
mermaid: true
script: 'assets/scripts/ga-pv.js'
---

<script>{% include_relative assets/scripts/ga-pv.js %}</script>
<script>{% include_relative assets/scripts/newsletter.js %}</script>

## Introduction

Fenwick Trees, also known as Binary Indexed Trees (BITree), are essential data structures extensively used for efficiently solving range query problems. What sets Fenwick Trees apart is their ability to compute the values of a given function $f$ over a specific range $[1:r]$, where $r$ represents the right endpoint. The formula for this function is:

$$f(arr[1], arr[l+1], \ldots, arr[r-1], arr[r])$$

If $f$ is a reversible function, then we can apply this concept to any range $[l:r]$. To fully grasp the power of the Fenwick Tree, let's delve into a fundamental problem and consider $f$ as the summation of array elements.

### The Problem
Given an array $arr[1 \ldots n]$, you will encounter queries of two types:
1. Given an index $x$, find the sum of elements in the array from index 1 to $x$ (inclusive).
2. Given an index $x$ and a value $val$, add $val$ to $arr[x]$.

### The Solution
At first glance, you might approach this with a straightforward solution: performing updates in $O(1)$ time and calculating the sum of elements through a linear loop in $O(n)$ time. Alternatively, you could create a prefix array to store cumulative sums, enabling $O(1)$ query responses. However, this approach sacrifices the efficiency of update operations ($O(n)$). To tackle this, let's explore the Binary Indexed Tree (BITree) data structure, which optimizes both update and query operations to $O(\log n)$, where $n$ is the array size.

### The Insight
BITrees are based on a simple concept: any number can be expressed as a sum of powers of 2. Similarly, a range $[1:x]$ can be represented as the sum of successive sub-ranges, each of which has a size that is a power of 2. This idea will become clearer as we explore further.

Consider the array (assuming a 1-based array indexing):

In the BITree, each index $\text{idx}$ stores the sum of values from $\text{idx} - 2^r + 1$ to $\text{idx}$ (inclusive), where $r$ is the position of the least significant bit of $\text{idx}$. For instance, at index 6, with a binary representation of 110, the least significant set bit is at position 1. Consequently, $\text{BIT}[6]$ represents the range from 5 to 6. Similarly, you can construct a table that displays the values stored at different indexes:

| Index | Stored Value |
|-------|--------------|
| 1     | arr[1]       |
| 2     | arr[1]       |
| 3     | arr[1] + arr[2] |
| 4     | arr[4]       |
| 5     | arr[1] + arr[2] + arr[4] |
| 6     | arr[6]       |
| 7     | arr[1] + arr[2] + arr[4] + arr[6] |
| 8     | arr[8]       |
| ...   | ...          |

By understanding this structure, you can efficiently compute range sums. For example, the sum from index 1 to 7 can be calculated as $\text{BIT}[7] + \text{BIT}[6] + \text{BIT}[4]$, using binary representations 111, 110, and 100, respectively. This pattern continues for other ranges.

The name "tree" comes from considering the larger segment as the parent of the smaller ones contained within it. Moving to the parent of a segment involves adding the least significant bit repeatedly ($\text{idx} + (\text{idx} \& -\text{idx})$). The process can be reversed to traverse to children.

## Implementation

### Point Update

To perform updates on the tree, add the value to all segments containing the given point. The update operation mirrors the reverse of the summation operation:

```c++
void update(int idx, int val) {
    while (idx <= N) {
        BIT[idx] += val;
        idx += idx & -idx;
    }
}
```