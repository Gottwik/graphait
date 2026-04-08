export type NodeType = 'question' | 'end' | 'start' | 'comment'

export interface OutputPort {
  id: string
  label: string
}

export interface QAPair {
  question: string
  answer: string
  type: string
}

export interface NextQuestionResponse {
  question: string
  type: 'text' | 'reorder' | 'multi'
  options?: string[]
  placeholder?: string
}

export interface Recommendation {
  neighborhood: string
  borough: string
  pitch: string
  tags: string[]
  honorableMention: {
    neighborhood: string
    reason: string
  }
  agentBio?: string
  leadPrompt?: string
  leadConfirmation?: string
}

export type QuestionType = 'text' | 'reorder' | 'multi'

export interface GraphNode {
  id: string
  x: number
  y: number
  title: string
  type: NodeType
  qtype?: QuestionType
  note?: string
  text?: string
  duration?: number
  options?: string[]
  outputPorts?: OutputPort[]
}

export interface GraphEdge {
  from: string
  fromPortId?: string
  fromAnswer?: number
  to: string
}

export interface GraphJSON {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
