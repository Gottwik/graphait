# Graphait — Graph-assisted AI

AI is powerful. But it doesn't know your business, your customers, or the hard-won knowledge your team has built over years. Graphait bridges that gap.

It lets you map out your decision logic as a visual graph — the questions to ask, the paths to take, the outcomes to reach — and then feed that structure directly into an AI conversation. The result is an AI that reasons the way *you* would, not just the way a language model was trained to.

---

## The idea

Most AI tools treat your knowledge as something to be inferred. Graphait makes it explicit.

You draw the flow. You decide what gets asked, in what order, and what each answer means. The AI follows your structure — and within that structure, it can still be smart, empathetic, and conversational. You get the best of both: human expertise guiding the process, AI handling the interaction.

```
[start] ──► [What matters most to you?]
                      │
          ┌───────────┼───────────┐
        schools    nightlife   nature
          │           │           │
          ▼           ▼           ▼
      [question]  [question]  [question]
                                  │
                                  ▼
                              [result]
```

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

// Load your graph (designed visually, exported as JSON)
const graph = normalizeGraphPorts(rawGraph)

// Start at the beginning
let current = findEntryNode(graph)

// After each answer, follow the right path
const nextId = findNextNode(graph, current.id, 'schools')
```

---

## API

### `normalizeGraphPorts(graph)`
Prepares a graph for traversal. Call this once when you load your graph JSON.

### `findEntryNode(graph)`
Returns the first node — your conversation's starting point.

### `findNextNode(graph, nodeId, portId)`
Given where you are and what the user chose, returns where to go next.

### `slugify(label)`
Turns a label like `"Yes / has kids"` into a stable ID like `"yes_has_kids"`.

---

## Types

```ts
import type {
  GraphJSON,
  GraphNode,
  GraphEdge,
  OutputPort,
  NodeType,      // 'start' | 'question' | 'end' | 'comment'
  QuestionType,  // 'text' | 'multi' | 'reorder'
} from '@gottwik/graphait'
```

---

## Related

- [graphait-ui](https://github.com/Gottwik/graphait-ui) — the visual editor for building your graphs
- [quiz-ui](https://github.com/Gottwik/quiz-ui) — React components for running graph-assisted AI conversations
