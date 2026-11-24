import { describe, it, expect } from 'vitest'
import { suggestedOrder } from './navigation'
import type { GraphJSON } from './types'

const port = [{ id: 'next', label: 'Next' }]
const line: GraphJSON = {
  nodes: [
    { id: 'start', type: 'start', title: '', text: 'Hello' },
    { id: 'a', type: 'question', title: 'A', markers: ['m1'], group: 'warm-up', outputPorts: port },
    { id: 'b', type: 'question', title: 'B', markers: ['m2', 'm3'], outputPorts: port },
    { id: 'end', type: 'end', title: '' },
  ],
  edges: [
    { from: 'start', to: 'a' },
    { from: 'a', fromPortId: 'next', to: 'b' },
    { from: 'b', fromPortId: 'next', to: 'end' },
  ],
}

describe('suggestedOrder', () => {
  it('reads a straight graph in order', () => {
    const r = suggestedOrder(line)
    expect(r.start?.id).toBe('start')
    expect(r.topics.map(t => t.id)).toEqual(['a', 'b'])
    expect(r.topics[0].markers).toEqual(['m1'])
    expect(r.topics[0].group).toBe('warm-up')
    expect(r.problems).toEqual([])
  })

  it('follows the first exit of a node with several', () => {
    const g: GraphJSON = {
      nodes: [
        { id: 'start', type: 'start', title: '' },
        {
          id: 'a', type: 'question', title: 'A',
          outputPorts: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }],
        },
        { id: 'b', type: 'question', title: 'B', outputPorts: port },
        { id: 'c', type: 'question', title: 'C', outputPorts: port },
        { id: 'end', type: 'end', title: '' },
      ],
      edges: [
        { from: 'start', to: 'a' },
        { from: 'a', fromPortId: 'no', to: 'c' },
        { from: 'a', fromPortId: 'yes', to: 'b' },
        { from: 'b', fromPortId: 'next', to: 'end' },
        { from: 'c', fromPortId: 'next', to: 'end' },
      ],
    }
    const r = suggestedOrder(g)
    expect(r.topics.map(t => t.id)).toEqual(['a', 'b'])
    expect(r.problems.some(p => p.includes('start node') || p.includes('loops') || p.includes('way out'))).toBe(false)
  })

  it('walks through a comment node and leaves it out', () => {
    const g: GraphJSON = {
      nodes: [
        { id: 'start', type: 'start', title: '' },
        { id: 'a', type: 'question', title: 'A', outputPorts: port },
        { id: 'note', type: 'comment', title: 'Note' },
        { id: 'b', type: 'question', title: 'B', outputPorts: port },
        { id: 'end', type: 'end', title: '' },
      ],
      edges: [
        { from: 'start', to: 'a' },
        { from: 'a', fromPortId: 'next', to: 'note' },
        { from: 'note', to: 'b' },
        { from: 'b', fromPortId: 'next', to: 'end' },
      ],
    }
    const r = suggestedOrder(g)
    expect(r.topics.map(t => t.id)).toEqual(['a', 'b'])
    expect(r.problems).toEqual([])
  })

  it('says when there is no start', () => {
    const r = suggestedOrder({ nodes: [line.nodes[1], line.nodes[3]], edges: [] })
    expect(r.start).toBeNull()
    expect(r.problems).toEqual(['the graph has no start node'])
  })

  it('says when the end is never reached', () => {
    const g: GraphJSON = {
      nodes: line.nodes.slice(0, 3),
      edges: [
        { from: 'start', to: 'a' },
        { from: 'a', fromPortId: 'next', to: 'b' },
        { from: 'b', fromPortId: 'next', to: 'gone' },
      ],
    }
    expect(suggestedOrder(g).problems).toContain('the path from start never reaches an end node')
  })

  it('says when the path loops', () => {
    const g: GraphJSON = {
      nodes: line.nodes,
      edges: [
        { from: 'start', to: 'a' },
        { from: 'a', fromPortId: 'next', to: 'b' },
        { from: 'b', fromPortId: 'next', to: 'a' },
      ],
    }
    expect(suggestedOrder(g).problems).toContain('the path loops back to a')
  })

  it('says when a node has no way out', () => {
    const g: GraphJSON = {
      nodes: line.nodes,
      edges: [{ from: 'start', to: 'a' }, { from: 'a', fromPortId: 'next', to: 'b' }],
    }
    expect(suggestedOrder(g).problems).toContain('node b has no way out')
  })

  it('says when a question is never reached', () => {
    const g: GraphJSON = {
      nodes: [...line.nodes, { id: 'c', type: 'question', title: 'C', outputPorts: port }],
      edges: line.edges,
    }
    const r = suggestedOrder(g)
    expect(r.problems).toEqual(['node c is not on the path from start to end'])
    expect(r.topics.map(t => t.id)).toEqual(['a', 'b'])
  })

  it('does not throw on null, or on nodes and edges that are not arrays', () => {
    expect(() => suggestedOrder(null as never)).not.toThrow()
    expect(suggestedOrder(null as never).problems).toEqual(['the graph has no start node'])
    const bad = { nodes: 'x', edges: 5 } as never
    expect(() => suggestedOrder(bad)).not.toThrow()
    expect(suggestedOrder(bad).topics).toEqual([])
    const noEdges = { nodes: line.nodes, edges: null } as never
    expect(() => suggestedOrder(noEdges)).not.toThrow()
  })
})
