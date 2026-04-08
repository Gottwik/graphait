// src/navigation.ts
function slugify(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function normalizeGraphPorts(graph) {
  const nodes = graph.nodes.map(normalizeNodePorts);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edges = graph.edges.map((edge) => {
    if (edge.fromPortId) return edge;
    const fromNode = nodeMap.get(edge.from);
    if (fromNode?.outputPorts && edge.fromAnswer !== void 0 && fromNode.outputPorts[edge.fromAnswer]) {
      return { ...edge, fromPortId: fromNode.outputPorts[edge.fromAnswer].id };
    }
    return edge;
  });
  return { nodes, edges };
}
function normalizeNodePorts(node) {
  if (node.type !== "question") return node;
  if (node.outputPorts && node.outputPorts.length > 0) return node;
  return {
    ...node,
    outputPorts: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "other", label: "Other / unclear" }
    ]
  };
}
function findEntryNode(graph) {
  const startNode = graph.nodes.find((n) => n.type === "start");
  if (startNode) return startNode;
  const targetIds = new Set(graph.edges.map((e) => e.to));
  return graph.nodes.find((n) => n.type === "question" && !targetIds.has(n.id)) ?? null;
}
function findNextNode(graph, currentNodeId, portId) {
  const edge = graph.edges.find(
    (e) => e.from === currentNodeId && e.fromPortId === portId
  );
  return edge?.to ?? null;
}
export {
  findEntryNode,
  findNextNode,
  normalizeGraphPorts,
  slugify
};
//# sourceMappingURL=index.mjs.map