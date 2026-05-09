# @gottwik/graphait

> Graph navigation engine and shared types for building node-based quiz flows.

```
  [start] ──► [question] ──yes──► [question] ──► [end]
                   │                    │
                  no                  other
                   │                    │
                   ▼                    ▼
              [question]             [end]
```

Ships as ESM + CJS with full TypeScript types. Zero runtime dependencies.

---

## Install

```bash
npm install github:Gottwik/graphait#v1.0.0
```

---

## The Graph Model

A graph is just nodes and edges:

```ts
interface GraphJSON {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
```

### Nodes

```
┌─────────────────────────────────────────────────────┐
│  GraphNode                                          │
├──────────────┬──────────────────────────────────────┤
│  id          │  unique identifier                   │
│  type        │  'start' | 'question' | 'end'        │
│              │  | 'comment'                         │
│  title       │  display label                       │
│  qtype       │  'text' | 'reorder' | 'multi'        │
│  options     │  choices (multi/reorder questions)   │
│  outputPorts │  named exit ports                    │
│  text        │  body copy / answer text             │
│  note        │  internal editor note                │
│  x, y        │  canvas position                     │
└──────────────┴──────────────────────────────────────┘
```

### Edges

```ts
interface GraphEdge {
  from: string       // source node id
  fromPortId?: string  // which output port
  fromAnswer?: number  // legacy index-based port ref
  to: string         // destination node id
}
```

### Output Ports

Each question node has named output ports. If none are defined, they default to:

| Port ID | Label          |
|---------|----------------|
| `yes`   | Yes            |
| `no`    | No             |
| `other` | Other / unclear |

---

## API

### `findEntryNode(graph)`

Returns the entry point of the graph — the `start` node if one exists, otherwise the first question node with no incoming edges.

```ts
import { findEntryNode } from '@gottwik/graphait'

const entry = findEntryNode(graph)
// → GraphNode | null
```

### `findNextNode(graph, currentNodeId, portId)`

Follows an edge from a given node via a specific output port.

```ts
import { findNextNode } from '@gottwik/graphait'

const nextId = findNextNode(graph, 'node-1', 'yes')
// → 'node-2' | null
```

### `normalizeGraphPorts(graph)`

Ensures all edges use `fromPortId` (string) rather than the legacy `fromAnswer` (index). Also fills in default ports for any question nodes missing them. Run this once on load.

```ts
import { normalizeGraphPorts } from '@gottwik/graphait'

const normalized = normalizeGraphPorts(rawGraph)
```

### `slugify(label)`

Converts a port label to a stable slug for use as a port ID.

```ts
import { slugify } from '@gottwik/graphait'

slugify('Yes / has kids') // → 'yes_has_kids'
```

---

## Usage Example

```ts
import {
  normalizeGraphPorts,
  findEntryNode,
  findNextNode,
} from '@gottwik/graphait'

const graph = normalizeGraphPorts(rawGraph)

let current = findEntryNode(graph)

// user answers 'yes' on the first question
const nextId = findNextNode(graph, current.id, 'yes')
```

---

## Types

All types are exported from the root:

```ts
import type {
  GraphJSON,
  GraphNode,
  GraphEdge,
  OutputPort,
  NodeType,
  QuestionType,
  NextQuestionResponse,
  Recommendation,
  QAPair,
} from '@gottwik/graphait'
```

---

## Build

```bash
npm run build   # outputs to dist/ via tsup
```

Exports:

| Format | File               |
|--------|--------------------|
| ESM    | `dist/index.mjs`   |
| CJS    | `dist/index.js`    |
| Types  | `dist/index.d.ts`  |

---

## Related

- [`@gottwik/graphait-ui`](https://github.com/Gottwik/graphait-ui) — visual graph editor and chat interface
- [`@gottwik/quiz-ui`](https://github.com/Gottwik/quiz-ui) — quiz UI components powered by graphait
