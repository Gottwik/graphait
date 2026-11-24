type NodeType = 'question' | 'end' | 'start' | 'comment';
interface OutputPort {
    id: string;
    label: string;
}
interface QAPair {
    question: string;
    answer: string;
    type: string;
}
interface NextQuestionResponse {
    question: string;
    type: 'text' | 'reorder' | 'multi';
    options?: string[];
    placeholder?: string;
}
interface Recommendation {
    neighborhood: string;
    borough: string;
    pitch: string;
    tags: string[];
    honorableMention: {
        neighborhood: string;
        reason: string;
    };
    agentBio?: string;
    leadPrompt?: string;
    leadConfirmation?: string;
}
type QuestionType = 'text' | 'reorder' | 'multi';
interface GraphNode {
    id: string;
    x?: number;
    y?: number;
    title: string;
    type: NodeType;
    qtype?: QuestionType;
    note?: string;
    text?: string;
    duration?: number;
    options?: string[];
    outputPorts?: OutputPort[];
    /** What this question is meant to find out about. */
    markers?: string[];
    /** A label for a run of questions that belong together. */
    group?: string;
    meta?: Record<string, unknown>;
}
interface GraphEdge {
    from: string;
    fromPortId?: string;
    fromAnswer?: number;
    to: string;
}
interface GraphJSON {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

/** "Yes / has kids" → "yes_has_kids" */
declare function slugify(label: string): string;
declare function normalizeGraphPorts(graph: GraphJSON): GraphJSON;
declare function findEntryNode(graph: GraphJSON): GraphNode | null;
declare function findNextNode(graph: GraphJSON, currentNodeId: string, portId: string): string | null;
interface SuggestedOrder {
    start: GraphNode | null;
    topics: GraphNode[];
    problems: string[];
}
/**
 * The questions in the order the graph suggests: from the start node to the
 * first end node, always taking a node's first exit (the edge from its first
 * output port, else its first edge). Comment nodes are walked through and left
 * out. Never throws; whatever is wrong with the graph comes back in `problems`.
 */
declare function suggestedOrder(graph: GraphJSON): SuggestedOrder;

export { type GraphEdge, type GraphJSON, type GraphNode, type NextQuestionResponse, type NodeType, type OutputPort, type QAPair, type QuestionType, type Recommendation, type SuggestedOrder, findEntryNode, findNextNode, normalizeGraphPorts, slugify, suggestedOrder };
