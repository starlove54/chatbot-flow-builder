import { useCallback, useEffect, useState } from 'react'
import './App.css'
import ReactFlow, {
  Connection,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Panel,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { initialEdges, initialNodes } from './Utilities/Constants'
import { TextMessage } from './MessageTypes/index'
import NodesPanel from './components/NodesPanel'
import SettingsPanel from './components/SettingsPanel'

const nodeTypes = {
  textMessage: TextMessage,
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [showNodesPanel, setShowNodesPanel] = useState(true) // State to show the nodes panel
  const [selectedNodeId, setSelectedNodeId] = useState<null | string>(null) // State to store the selected node id

  const { setViewport, toObject } = useReactFlow()
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = { ...params, id: `${edges.length + 1}`, animated: true }
      setEdges((prevEdges) => addEdge(edge, prevEdges))
    },
    [edges.length, setEdges]
  )

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const reactFlowBounds = event.currentTarget.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')

    if (!type) {
      return
    }

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    }

    const newNode = {
      id: `${nodes.length + 1}`,
      type: type,
      data: {},
      position: position,
    }

    switch (type) {
      case 'textMessage':
        newNode.data = { textMessage: `text message ${nodes.length + 1}` }
        break
      // Add more cases here for different node types
      default:
        newNode.data = {} // Default data for unknown types
    }

    setNodes((prevNodes) => [...prevNodes, newNode])
  }

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleNodeClick = useCallback(
    (
      event: React.MouseEvent,
      node: {
        id: string
        data: { textMessage: string }
        position: { x: number; y: number }
        type: string
      }
    ) => {
      setShowNodesPanel(false)
      setSelectedNodeId(node.id)
    },
    []
  )

  const flowKey = 'chatbot-flow-builder'

  const handleSaveChanges = useCallback(() => {
    // Check for empty target handles
    const nodesWithEmptyTargetHandles = nodes.filter(
      (node) =>
        node.type === 'textMessage' &&
        !edges.find((edge) => edge.target === node.id)
    )
    if (nodesWithEmptyTargetHandles.length > 1) {
      setErrorMessage('Error: Cannot save flow')
      return
    } else {
      setErrorMessage('')
    }
    const flow = toObject()
    localStorage.setItem(flowKey, JSON.stringify(flow))
    setShowNodesPanel(true) // Show nodes panel again on successful save
    setSelectedNodeId(null)
  }, [nodes, edges, toObject])

  useEffect(() => {
    const savedFlow = localStorage.getItem(flowKey)
    if (savedFlow) {
      const flow = JSON.parse(savedFlow)
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])
      setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 })
    }
  }, [setNodes, setEdges, setViewport])

  const handleBackgroundClick = useCallback(() => {
    setSelectedNodeId(null)
    setShowNodesPanel(true)
  }, [])

  const updateNode = useCallback(
    (updatedNode: {
      id: string
      data: { textMessage: string }
      position: { x: number; y: number }
      type: string
    }) => {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id === updatedNode.id) {
            return updatedNode
          }
          return node
        })
        return updatedNodes
      })
    },
    [setNodes]
  )

  return (
    <>
      <div className="w-full h-20 bg-slate-400 flex items-center justify-end ">
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mr-2">
            {errorMessage}
          </div>
        )}
        <button
          className="bg-white text-blue-600 border border-blue-500 rounded-lg px-4 py-2 m-2 mr-40 hover:bg-blue-500 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleSaveChanges}
        >
          Save changes
        </button>
      </div>
      <div className="flex border-2 h-[90vh] w-[100vw] ">
        <div className="flex-grow  ">
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              style: {
                ...node.style,
                border:
                  selectedNodeId === node.id ? '1px solid blue' : undefined,
                borderRadius: 10,
              },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={handleNodeClick}
            onPaneClick={handleBackgroundClick}
          >
            <Controls showInteractive={false} />
            <Panel position="top-left">Chatbot flow builder</Panel>
            <MiniMap zoomable pannable />
          </ReactFlow>
        </div>
        <div className=" border-l-2 border-slate-200 w-[300px] lg:w-[400px] grid grid-cols-2  gap-2  pb-6  ">
          {showNodesPanel ? (
            <NodesPanel />
          ) : (
            <SettingsPanel
              setShowNodesPanel={setShowNodesPanel}
              node={nodes.find((node) => node.id === selectedNodeId)}
              updateNode={updateNode}
            />
          )}
        </div>
      </div>
    </>
  )
}
export default App
