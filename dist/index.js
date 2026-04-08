"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  findEntryNode: () => findEntryNode,
  findNextNode: () => findNextNode,
  normalizeGraphPorts: () => normalizeGraphPorts,
  slugify: () => slugify
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findEntryNode,
  findNextNode,
  normalizeGraphPorts,
  slugify
});
//# sourceMappingURL=index.js.map