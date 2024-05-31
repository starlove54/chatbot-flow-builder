import { Handle, NodeProps, Position, useEdges } from 'reactflow'
import { MessageCircleMore } from 'lucide-react'
import whatsapp from '../assets/icons/whatsapp-icon.svg'

type TextMessageProps = {
  id: string
  textMessage: string
  setSelectedNodeId: (id: string) => void
}

const TextMessage = ({
  id,
  data: { textMessage },
}: NodeProps<TextMessageProps>) => {
  const edges = useEdges()

  const outgoingEdges = edges.filter((edge) => edge.source === id)

  const canCreateEdge = outgoingEdges.length === 0
  return (
    <>
      <div className={`flex flex-col w-[300px]  shadow-xl rounded-b-lg `}>
        <div className="bg-green-100 flex flex-row items-center gap-2 py-2 px-2 rounded-t-lg">
          <div>
            <MessageCircleMore size={12} />
          </div>
          <p className="font-bold text-md">Send Message</p>
          <div className="ml-auto">
            <img src={whatsapp} height={14} width={14} />
          </div>
        </div>
        <div className=" flex justify-start h-full px-2 py-4 bg-white rounded-lg flex-wrap  ">
          <span className="text-sm break-all">{textMessage}</span>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          isValidConnection={(connection) => canCreateEdge}
        />
        <Handle type="target" position={Position.Left} />
      </div>
    </>
  )
}

export default TextMessage
