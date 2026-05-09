# Graphait — Graph-assisted AI

AI is powerful. But it doesn't know your business, your customers, or the hard-won knowledge your team has built over years. Graphait bridges that gap.

It lets you map out your decision logic as a visual graph — the questions to ask, the paths to take, the outcomes to reach — and then feed that structure directly into an AI conversation. The result is an AI that reasons the way *you* would, not just the way a language model was trained to.

---

## The idea

Most AI tools treat your knowledge as something to be inferred. Graphait makes it explicit.

You draw the flow. You decide what gets asked, in what order, and what each answer means. The AI follows your structure — and within that structure, it can still be smart, empathetic, and conversational. You get the best of both: human expertise guiding the process, AI handling the interaction.

```
[start] ──► [What is the nature of the issue?]
                          │
          ┌───────────────┼───────────────┐
       hardware        software        access
          │               │               │
          ▼               ▼               ▼
      [question]      [question]      [question]
          │                               │
          ▼                               ▼
     [escalate]                    [self-service]
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

// After each response, follow the right path
const nextId = findNextNode(graph, current.id, 'hardware')
```

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

## Graphait UI

[graphait-ui](https://github.com/Gottwik/graphait-ui) is the visual editor for building your graphs. Instead of writing JSON by hand, you drag and drop nodes onto a canvas, connect them with edges, and configure each step — then export the graph as JSON for use at runtime.

It's designed to be embedded into your own admin interface, so non-technical team members can own and update the decision logic without touching code.
