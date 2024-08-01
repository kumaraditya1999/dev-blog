---
title: Graph Algorithms In Python
date: 2024-03-25 10:10:10 +0530
categories: [Python]
tags: [python, c++, ds, stl]
math: true
mermaid: true
img_path: /assets/images/page-view/
---

This post is continuation of the previous [post](https://kumaraditya1999.github.io/dev-blog/posts/C++-STL-Library-Counterparts-In-Python/){:target="_blank"}. Most of the things like basic `data structures` and `algorithms` like `searching` and `sorting` were covered, the only thing that remains is the `graph algorithms`. Graph algorithms are very standard and are must for any competitive programmer so we will explore them in this post. After reading these two post you should be equipped with enough implementation knowledge to solve the first few easy problems in contests.

## Before You Read
There are two main ways to represent graph, first `Adjacency Martix` where $$adj[u][v]$$ is $$True$$ if there is an edge from $$u$$ to $$v$$. Second, `Adjacency List` where $$adj[u]$$ contains the list of all the nodes adjacent to the node $$u$$. If the graph is sparse, it is preferred to store it as an 'Adjacency List' rather than a 'Matrix' due to its lower space consumption ($$O(E)$$ vs $$O(N^2)$$) and also iterating over adjacent elements is more efficient ($$O(deg)$$ vs $$O(N)$$).

A very useful tool to visualize graphs can be found [here](https://csacademy.com/app/graph_editor/){:target="_blank"}, its a life saver!

## Union Find

`Union Find` or `DSU (Disjoint Set Union)` is one of the most common data structure you need in order to solve problems like, do the two nodes lie in the same `connected component`? what is the `size of the connected component` ? how many `connected components are there` ? and other questions related to `connectivity`. All these questions can be answered in almost constant time $$O(\alpha(N))$$. To learn more about this data structure, you can refer this [link](https://cp-algorithms.com/data_structures/disjoint_set_union.html){:target="_blank"}

```python
class DSU:
    def __init__(self, n) -> None:
        self.n = n
        self.parent = [i for i in range(n)]
        self.rank = [1] * n

    # this finds the parent with path compression
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    # union merges two component in the graph, 
    # here we are using the rank as component size
    # we merge the smaller component in the larger one
    # gives O(log(N)) complexity for union operation
    def union(self, x, y):
        x = self.find(x)
        y = self.find(y)
        if x != y:
            if self.rank[x] < self.rank[y]:
                x, y = y, x
            self.parent[y] = x
            self.rank[x] += self.rank[y]
```

As you can see to implement the union find data structure, you just need one to know `lists`.

> Lets try to attemp a [practice problem](https://codeforces.com/problemset/problem/1249/B2){:target="_blank"} to understand DSU better. If you are unable to solve the problem then see the solution and implementation below.

<details>
    <summary>Solution</summary>
    You can construct a graph of the nodes, an edge is between from a person to the next person where the book will be sent. Since there is only one edge per person you can observe that the final graph will be set of cycles. Now the solution is to just print the length of the cycle where the node lies.
    Here is an <a href="https://codeforces.com/contest/1249/submission/253959783" target="_blank">accepted solution </a> for the problem.
</details>

## BFS

BFS is `breadth first search`, its one of the two elementary graph searching algorithms. The idea behind BFS is simple. You have a `source` node, you explore all the nodes `adjacent` to the source node, then you search all the nodes that are `adjacent` to the `adjacent nodes` and you continue till all the nodes are searched. BFS is implemented using a `queue`, so we will also do the same. If you want to learn BFS in depth, I would suggest you to read this [article](https://cp-algorithms.com/graph/breadth-first-search.html){:target="_blank"}.

```python
from collections import dequeue

# we assume the graph is stored as an adjacency list
# graph[node] -> returns a list containing all the nodes that are adjacent to node
def bfs(src):
    vis = [i == src for i in range(n)]
    q = deque([src])
    while q:
        node = q.popleft()
        for child in graph[node]:
            if not vis[child]:
                vis[child] = True
                q.append(child)

```

> Note that we are not using `Queue` which is present in python but instead we are using `dequeue`. Since `Queue` is slower due to additional abstractions on top of `deque`. [Source](https://stackoverflow.com/questions/717148/queue-queue-vs-collections-deque){:target="_blank"}
{: .prompt-info }

If you see the implementation of BFS in python its almost like pseudo code, thats the power of python I guess 😀 

> Lets try a problem! Try to attemp the [practice problem](https://codeforces.com/problemset/problem/1249/B2){:target="_blank"} and see solution and implementation below.

<details>
    <summary>Solution</summary>
    This can easily be modelled into graph. For each graph you will have set of connected components. Even if one of the node has the information eventually it will spread to all the nodes. So in this case find all the connected components, and get the smallest value in the connected components. Some of the smallest values in the connected component would be the answer.
    
    Here is an <a href="https://codeforces.com/contest/893/submission/253965378" target="_blank">accepted solution </a> for the problem.
</details>

## DFS

DFS is even simpler to implement than bfs. The core idea, start with source, go to next adjacent node that is not visted, and start dfs from there. Once back, start from there. DFS might sound simple, but it is used to solve the most complicated problems like finding `bridges`, `dp on trees`, `topologial sorting`, finding `strongly connected components`. If you are new to these topics I highly suggest you to read this [article](https://cp-algorithms.com/graph/depth-first-search.html){:target="_blank"}.

```python
def dfs(node):
    vis[node] = True
    for nxt in graph[node]:
        if not vis[nxt]:
            par[nxt] = node
            dfs(nxt)

dfs(src)
```

> Here is a [sample problem](https://codeforces.com/contest/862/problem/B){:target="_blank"} you can try. Once you are out of ideas, read the solution and implementation.

> If you attempted the problem using dfs and used vanilla dfs then most probably you would have encountered `runtime error`. This is because in recursion the stack limit for the function would have been reached, causing error. To avoid that either you can increase the `stack size`, which might lead to memory limit exceeded exception or you can decorate a function to become iterative instead of recursive (implmentation is given in the solution section). Read more about this issue [here](https://codeforces.com/blog/entry/80158).
{: .prompt-danger }

<details>
    <summary>Solution</summary>
    You need to color the graph, 0 and 1 alternatively. You can connect any 0 marked node with a 1 marked node. So the answer is count(0) * count(1), but this also contains the already exsisting edges so remove that to get the final answer.
    
    Implementation that gives <a href="https://codeforces.com/contest/862/submission/254263553" target="_blank">Runtime Error </a>.
    Here is an <a href="https://codeforces.com/contest/862/submission/254264400" target="_blank">accepted solution </a> for the problem.
</details>

## Dijkstra's Algorithm For Shortest Path

Lets talk about the most important algorithm for graphs, the shortest path algorithm. Its very similar to `BFS`. You will have a source node, you have weights on the edges and you need to find the shortest path to all the nodes in the graph. You start with exploring all the neighbouring nodes, updating their distance and then putting them in a set of explored nodes. Then next you take the node with the shortest distance and start exploring again, mark this node as completed and remove from the set. You do it till you exhaust all the nodes. The time complexity of Djikstra is $$O(V * log(E))$$ where $$V$$ is the number of nodes and $$E$$ is the number of edges.

```python
import heapq

# here the adj contains the elements [node, weight of the edge]
def djikstra(src):
    dist = [10**14] * n
    dist[src] = 0
    priority_queue = [(0, src)]
    parent = [-1] * n

    while priority_queue:
        d, u = heapq.heappop(priority_queue)
        for v, w in adj[u]:
            if dist[v] > d + w:
                dist[v] = d + w
                parent[v] = u
                heapq.heappush(priority_queue, (dist[v], v))
    print(dist)

solve()
```

> Dijkstra's algorithm works only when there are no negative weight cycles in the graph; otherwise, it will go into an infinite loop. To tackle those problems you should learn other alorithms like `Bellman-Ford`(for negative edges). Also, it only calculates the distance from a single node; to calculate it for all pairs of nodes you should learn `Floyd-Warshall`. The entire list can be found [here](https://cp-algorithms.com/graph/breadth-first-search.html){:target="_blank"}.
{: .prompt-info }

> Here is a direct [problem](https://codeforces.com/contest/20/problem/C) that asks for shortest path as well as the path.
<details>
    <summary>Solution</summary>
    Here is an <a href="https://codeforces.com/contest/20/submission/254273221" target="_blank">accepted solution </a> for the problem.
</details>

## The End

Hope this blog helped! Let me know your suggestions in the comments 😊