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
    x: number;
    y: number;
    title: string;
    type: NodeType;
    qtype?: QuestionType;
    note?: string;
    text?: string;
    duration?: number;
    options?: string[];
    outputPorts?: OutputPort[];
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

export { type GraphEdge, type GraphJSON, type GraphNode, type NextQuestionResponse, type NodeType, type OutputPort, type QAPair, type QuestionType, type Recommendation, findEntryNode, findNextNode, normalizeGraphPorts, slugify };
