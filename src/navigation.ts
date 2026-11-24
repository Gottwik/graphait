import type { GraphJSON, GraphNode } from './types'

/** "Yes / has kids" → "yes_has_kids" */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export function normalizeGraphPorts(graph: GraphJSON): GraphJSON {
  const nodes = graph.nodes.map(normalizeNodePorts)
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  const edges = graph.edges.map(edge => {
    if (edge.fromPortId) return edge
    const fromNode = nodeMap.get(edge.from)
    if (
      fromNode?.outputPorts &&
      edge.fromAnswer !== undefined &&
      fromNode.outputPorts[edge.fromAnswer]
    ) {
      return { ...edge, fromPortId: fromNode.outputPorts[edge.fromAnswer].id }
    }
    return edge
  })

  return { nodes, edges }
}

function normalizeNodePorts(node: GraphNode): GraphNode {
  if (node.type !== 'question') return node
  if (node.outputPorts && node.outputPorts.length > 0) return node

  return {
    ...node,
    outputPorts: [
      { id: 'yes',   label: 'Yes' },
      { id: 'no',    label: 'No' },
      { id: 'other', label: 'Other / unclear' },
    ],
  }
}

export function findEntryNode(graph: GraphJSON): GraphNode | null {
  const startNode = graph.nodes.find(n => n.type === 'start')
  if (startNode) return startNode
  const targetIds = new Set(graph.edges.map(e => e.to))
  return graph.nodes.find(n => n.type === 'question' && !targetIds.has(n.id)) ?? null
}

export function findNextNode(
  graph: GraphJSON,
  currentNodeId: string,
  portId: string,
): string | null {
  const edge = graph.edges.find(
    e => e.from === currentNodeId && e.fromPortId === portId,
  )
  return edge?.to ?? null
}

export interface SuggestedOrder {
  start: GraphNode | null
  topics: GraphNode[]
  problems: string[]
}

/**
 * The questions in the order the graph suggests: from the start node to the
 * first end node, always taking a node's first exit (the edge from its first
 * output port, else its first edge). Comment nodes are walked through and left
 * out. Never throws; whatever is wrong with the graph comes back in `problems`.
 */
export function suggestedOrder(graph: GraphJSON): SuggestedOrder {
  const nodes: GraphNode[] = Array.isArray(graph?.nodes) ? graph.nodes : []
  const edges = Array.isArray(graph?.edges) ? graph.edges : []
  const byId = new Map(nodes.map(n => [n.id, n]))

  const start = nodes.find(n => n.type === 'start') ?? null
  if (!start) return { start: null, topics: [], problems: ['the graph has no start node'] }

  const firstExit = (node: GraphNode): string | null => {
    const out = edges.filter(e => e.from === node.id)
    const portId = node.outputPorts?.[0]?.id
    const edge = (portId !== undefined && out.find(e => e.fromPortId === portId)) || out[0]
    return edge ? edge.to : null
  }

  const topics: GraphNode[] = []
  const problems: string[] = []
  const seen = new Set<string>([start.id])
  let reachedEnd = false
  let current: GraphNode = start

  for (;;) {
    const toId = firstExit(current)
    if (toId === null) {
      problems.push(`node ${current.id} has no way out`)
      break
    }
    const next = byId.get(toId)
    if (!next) {
      problems.push('the path from start never reaches an end node')
      break
    }
    if (seen.has(next.id)) {
      problems.push(`the path loops back to ${next.id}`)
      break
    }
    seen.add(next.id)
    if (next.type === 'end') {
      reachedEnd = true
      break
    }
    if (next.type === 'question') topics.push(next)
    current = next
  }

  if (reachedEnd) {
    for (const n of nodes) {
      if (n.type === 'question' && !seen.has(n.id)) {
        problems.push(`node ${n.id} is not on the path from start to end`)
      }
    }
  }

  return { start, topics, problems }
}
