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
