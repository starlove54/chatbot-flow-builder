import { ArrowLeft } from 'lucide-react'
import { Textarea } from './ui/textarea'

type SettingsPanelProps = {
  node:
    | {
        id: string
        data: { textMessage: string }
        position: { x: number; y: number }
        type: string
      }
    | undefined
  setShowNodesPanel: (showNodesPanel: boolean) => void
  updateNode: (updatedNode: {
    id: string
    data: { textMessage: string }
    position: { x: number; y: number }
    type: string
  }) => void
}

const SettingsPanel = ({
  node,
  setShowNodesPanel,
  updateNode,
}: SettingsPanelProps) => {
  const handleArrowClick = () => {
    setShowNodesPanel(true)
  }
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (node) {
      const updatedNode = {
        ...node,
        data: {
          ...node.data,
          textMessage: event.target.value,
        },
      }
      updateNode(updatedNode)
    }
  }
  return (
    <div className=" w-[300px] lg:w-[400px] h-full">
      <div className="border-b-2 flex items-center justify-between py-4">
        <ArrowLeft className="ml-4" onClick={handleArrowClick} />
        <h3 className="mx-auto">Message</h3>
      </div>
      <div className="py-10 border-b-2">
        <p className="ml-4">Text</p>
        <Textarea
          className="ml-4 mt-4 mr-14 w-[300px] lg:w-[370px] "
          value={node?.data.textMessage || ''}
          onChange={handleTextChange}
        />
      </div>
    </div>
  )
}

export default SettingsPanel
