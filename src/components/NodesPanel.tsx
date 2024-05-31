import { MessageCircleMore } from 'lucide-react'

const NodesPanel = () => {
  return (
    <div
      className="border-2 border-indigo-300 w-[150px] h-[100px] rounded-lg flex items-center justify-center mx-4 my-4"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('application/reactflow', 'textMessage')
        event.dataTransfer.effectAllowed = 'move'
      }}
    >
      <div className="drag-drop flex flex-col items-center ">
        <MessageCircleMore className="mb-3" />
        <p>Message</p>
      </div>
    </div>
  )
}

export default NodesPanel
