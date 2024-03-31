---
title: C++ STL Library Counterparts In Python
date: 2024-03-25 10:10:10 +0530
categories: [Python]
tags: [python, c++, ds, stl]
math: true
mermaid: true
img_path: /assets/images/page-view/
---

<script>{% include_relative assets/scripts/ga-pv.js %}</script>
<script>{% include_relative assets/scripts/newsletter.js %}</script>

`c++` is choice of majority of competitive programmers, and `python` is not that friendly. One significant reason for this preference is Python's slower code execution compared to C++. Python has an advantage, it has very very low learning curve, in case someone wants to learn the algorithm and not the language they can try python. However, it not advisable to run away from scary implementations since it's a part of programming but for starters lets overlook those complexities. It's not impossible to do competitive programming in python, there are people like [pagenegod](https://codeforces.com/profile/pajenegod) who have received grand master title in codeforces.

So this is my attempt to demystify python data structures in order to start competitive programming, as a `c++` users I have tried to compare and contrast how to use the Python counterparts; if you already know the c++ counter parts. 

## Dynamic Arrays

`list` is a collection of elements in python, just like `vectors` in c++. The difference in python's list and c++ vector is that in python's list the elements can be of varying data type. Here is a list of basic operations that vectors support and then corresponding things in python:

### Initializing And Inserts

```c++
vector<int> arr = {2, 3, 1, 5, 4}; // creates a list
arr.push_back(6); // adds a new element in the list
arr.insert(7, 0); // inserts the element 7 at position 0
```

```python
arr = [2, 3, 1, 5, 4] # initializes an empty list
arr.append(6) # adds 6 to the end 
arr.insert(7, 0) # adds 7 at position 0
```

The cost of operation of inserting at random position is $$O(n)$$ where n is the size of the collection, if inserted at the end the cost of operation is $$O(1)$$ for both vectors and list.

### Finding And Deleting Elements

```c++
auto it = find(arr.begin(), arr.end(), 2); // gets an iterator to the element
int index = distance(arr.begin(), it); // distance between the iterator is the actual index of the element

arr.erase(it); // removes the element
```

```python
index = arr.index(2) # finds the first index where value is 2
arr.pop(ind) # remove the element at index
```
The cost of finding is $$O(n)$$ in both the cases, the cost of deleting is also $$O(n)$$ if the position is random. If the position of deleting the element is last then the time complexity of deletion is $$O(1)$$ else it's $$O(n)$$. 

### Sorting And Reversing

```c++
sort(arr.begin(), arr.end()); // sorts the vector in increasing order
reverse(arr.begin(), arr.end()); // reverses the vector
```

```python
arr.sort() # sorts
arr.reverse() # reverses
```

To sort with specific keys, use the following:

```c++
// sorts the vector with different key, the third input is the custom comparator
std:sort(arr.begin(), arr.end(), [](int a, int b) { return f(a) < f(b); });
```

```python
def f(x):
    return x * x - 6 * x + 8

# sorts based on values of f(x), you can use lamda functions as well
arr.sort(key=f(x)) 
```

### Binary Search

The best thing about stl is you don't have write binary search from scratch, you have `lower_bound` and `upper_bound` implemented. Well python also has bisect. Lets see how to use them:

Remember it works only when the collections are sorted

```c++
// return the iterator to first element where *it >= x
auto l_it = lower_bound(arr.begin(), arr.end(), x); 

// return the iterator to first element where *it > x
auto h_it = upper_bound(arr.begin(), arr.end(), x); 
```

```python
import bisect

# returns the first index where arr[idx] >= x
l_idx = bisect.bisect_left(x)

# returns the first index where arr[idx] > x
r_idx = bisect.bisect_right(x)
```

## Sets

Sets are a collection of elements, they will not have duplicates. In `c++` the sets are ordered and implemented using `BinarySearchTrees` but in python it's implemented as a `HashTable`. So python's sets are same as `unordered_sets` in c++. The document says that the average operation cost for insertions and retrieval as $$O(1)$$ but they can be hacked to run on $$O(N)$$ which is their worst case scenario.

```python
st = {1, 2, 3, 4, 5} # sets in python are initialized using {}
st.add(6) # adds an element to the set
print(4 in st) # prints True if 4 is in the set
```

python sets support all the set operations:

```python

A = {1, 2, 3}
B = {3, 4, 5}

A == B  # A is equivalent to B
A != B  # A is not equivalent to B
A <= B  # A is subset of B A <B>= B    
A > B   # A is proper superset of B
A | B   # the union of A and B
A & B   # the intersection of A and B
A - B   # the set of elements in A but not B
A ˆ B   # the symmetric difference
```

> But again the danger is in the worst case time complexity, so if you want to avoid that it's better to use something else, people use their own implementation of [stuff](https://github.com/tatyam-prime/SortedSet/blob/main/SortedMultiset.py)
{: .prompt-danger }

## Dictionary

Dictionary are key value pairs in python, similar to `maps` in c++ usage wise but complexity wise they are not. Dictionaries also have $$O(1)$$ average time complexity for all the things, but worst case they are also $$O(N)$$ instead of the ideal $$O(log(N))$$ that c++ maps provide.

```python
my_dict = {
    "a": 1,
    "b": 2,
    "c": 3
}

my_dict.pop('c') # deletion
```

> There is something called ordered dictionary, which might be confusing for people using `c++` since usually ordered means ordered by key but in python it's ordered by time of insertion
{: .prompt-danger }

```python
from collections import OrderedDict

# The complexity of operations like insert, deletion and looup is still O(N) in worst case
my_dict = OrderedDict([('a', 1), ('b', 2), ('c', 3)])

```

Talking alot about dictionary won't really help if you are trying to do CP in python so we will skip this.

## Priority Queues / Heaps

> Priority queues in python are implemented using `heapq`. The `heapq` provides various methods present in the library to heapify a list and support the various heap operations in $$O(log(N))$$. 

If you are not aware of various heap operations and how they work, I would suggest you read [this](https://en.wikipedia.org/wiki/Heap_(data_structure)).
{: .prompt-tip }

```python
import heapq

my_heap = [1, 2, 3, 4, 5, 6, 7, 8]
heapq.heapify(my_heap) # this will heapify the list in O(N * log(N))

heapq.heappush(my_heap, 2) # this will push an element in O(log(N))

heapq.heappop(my_heap) # removes and returns the smallest element in O(log(N))

```

> These functions are enough to know, but if you want to know more about other operations please [read this](https://www.geeksforgeeks.org/heap-queue-or-heapq-in-python/)
{: .prompt-info }

There is also a priority queue implemented in python:

```python
from queue import PriorityQueue

pq = PriorityQueue()

# insert the values (priority, value)
pq.put((2, 'a'))
pq.put((1, 'b'))
pq.put((5, 'c'))
pq.put((4, 'd'))

# this will print the values (1, 'b'), (2, 'a'), (4, 'd'), (5, 'c')
while pq:
    print(pq.get())
```

Insertions and removals are both $$O(log(N))$$. The queue version uses heapq internally, however it's slower since it's made thread safe so it implements locks, encaptulations and stuff, which is not really required for competitive programming
{: .prompt-danger }

## Queue

There is an inbuilt Queue implemented in python, here is how to use it:

```python
from queue import Queue

q = Queue() # Initializes a queue
q.put(1) # adds 1 to the queue
q.put(2)
q.put(3)

q.get() # gets the first element in the queue and deletes it from the queue
```

## Deque

Python also supports the deque data structure:

```python
from collections import deque

dq = deque()

dq.append(1) # adds an element to the end of the deque
dq.appendleft(2) # adds an element to the begining of the deque

dq.pop() # pops an element from the right of the deque
dp.popleft() # pops an element from the left of the deque
```

> Python's deque datastructure can be used to implement the `stack`, `queue` and `deque` stl classes present in c++. Deques are better if you want to implement Queue and Stack operations.
{: .prompt-tip }

## Counters

This is a special mention. Alot of times there are case when you want to calculate the frequency of elements in an array. 

Implementation in c++ without sorting and searching:
```c++
vector<int> nums = {1, 2, 3, 4, 1, 2, 1, 3, 3, 4, 5};
unordered_map<int, int> freq;

for (int num: nums) freq[num]++
```

To implement it in python:
```python
from collections import Counters

nums = [1, 2, 3, 4, 1, 2, 1, 3, 3, 4, 5]
freq = Counter(nums) # contruct the frequency map of elements
print(freq[1]) # it will return the frequncy of 1
```

## The End

We will continue the discussion and implement some famous algorithms in python. I am fairly new to python so the contents of the blog may change in the future. Please leave your suggestions in the comments below