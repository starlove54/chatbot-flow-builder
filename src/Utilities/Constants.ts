import { Edge, MarkerType, Node } from 'reactflow'
import 'reactflow/dist/style.css'

export const initialNodes: Node[] = [
  {
    id: '1',
    data: { textMessage: 'text message 1' },
    position: { x: 100, y: 100 },
    type: 'textMessage',
  },
  {
    id: '2',
    data: { textMessage: 'text message 2' },
    position: { x: 200, y: 400 },
    type: 'textMessage',
  },
]

export const initialEdges: Edge[] = [
  {
    id: '1-2',
    source: '1',
    target: '2',
    markerEnd: {
      type: MarkerType.Arrow,
    },
  },
]
