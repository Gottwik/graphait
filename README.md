# @gottwik/graphait

The engine behind graph-driven quiz flows. Define your questions and branching logic as a graph — graphait handles traversal, port normalization, and shared types so you don't have to.

---

## Why

Building a quiz where the next question depends on the previous answer means managing branching logic somewhere. Hardcoding it gets messy fast. Graphait lets you model that logic as a simple JSON graph — nodes are questions, edges are the paths between them. You design the flow visually (with [graphait-ui](https://github.com/Gottwik/graphait-ui)), export the JSON, and use this library to walk through it at runtime.

---

## How it works

A graph has **nodes** (questions, a start, and end states) connected by **edges** (the paths between them). Each question node has **output ports** — one per possible answer — and edges connect those ports to the next node.

```
[start] ──► [Do you have kids?] ──yes──► [Do you want a yard?] ──► [end]
                                   │
                                  no
                                   │
                                   ▼
                             [Do you like nightlife?] ──► [end]
```

At runtime, you start at the entry node, show the question, get an answer, and follow the matching edge to the next node.

---

## Install

```bash
npm install github:Gottwik/graphait#v1.0.0
```

---

## Usage

```ts
import {
  normalizeGraphPorts,
  findEntryNode,
  findNextNode,
} from '@gottwik/graphait'

// 1. Normalize your graph JSON on load (resolves legacy edge formats)
const graph = normalizeGraphPorts(rawGraph)

// 2. Find where to start
let current = findEntryNode(graph)

// 3. After the user answers, follow the edge for that answer
const nextId = findNextNode(graph, current.id, 'yes')
```

---

## API

### `normalizeGraphPorts(graph)`
Call this once when you load your graph JSON. It ensures all edges reference ports by ID (rather than index), and fills in default Yes / No / Other ports for any question nodes that don't have custom ones.

### `findEntryNode(graph)`
Returns the starting node — the `start` node if one exists, otherwise the first question with no incoming edges.

### `findNextNode(graph, nodeId, portId)`
Given a current node and the port the user exited through, returns the ID of the next node (or `null` if there's no edge).

### `slugify(label)`
Converts a label like `"Yes / has kids"` to a stable port ID like `"yes_has_kids"`.

---

## Types

```ts
import type {
  GraphJSON,
  GraphNode,
  GraphEdge,
  OutputPort,
  NodeType,       // 'start' | 'question' | 'end' | 'comment'
  QuestionType,   // 'text' | 'multi' | 'reorder'
} from '@gottwik/graphait'
```

---

## Related

- [graphait-ui](https://github.com/Gottwik/graphait-ui) — visual editor for building graphs
- [quiz-ui](https://github.com/Gottwik/quiz-ui) — React components for rendering the quiz
