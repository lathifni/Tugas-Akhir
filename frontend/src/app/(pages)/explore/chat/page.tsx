'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { createNewRoomChat, fetchUserChats } from "../../api/fetchers/chat"
import Conversation from "./_components/conversation"
import ChatBox from "./_components/chatBox"
import { io } from 'socket.io-client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCommentMedical } from "@fortawesome/free-solid-svg-icons"
import AddChatDialog from "./_components/addChatDialog"

interface ChatData {
  fullname: string;
  user_image: string;
  chat_room_id: string;
  user_id: string
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState<ChatData>({ fullname: '', user_image: '', chat_room_id: '0', user_id: '0' })
  const [socket, setSocket] = useState<any>(undefined)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAddChatDialogOpen, setIsAddChatDialogOpen] = useState(false)
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  useEffect(() => {
    const getChats = async () => {
      try {
        if (session) {
          const userId = session.user.user_id;
          const data = await fetchUserChats(userId)
          setChats(data)

          const socket = io('ws://localhost:3002')
          socket.emit('new-user-add', userId)
          setSocket(socket)
        }
      } catch (error) {
        console.log(error);
      }
    }
    getChats()
  }, [session])

  const handleOpenChat = (chat:any) => {
    setCurrentChat(chat);
    setIsChatOpen(true); // Menampilkan chatbox pada layar kecil
  };

  const handleBackToConversations = () => {
    setIsChatOpen(false); // Menampilkan kembali daftar percakapan pada layar kecil
  };

  const handleSelectAdmin = async (adminId: number) => {
    setSelectedAdminId(adminId);
    const dataNewRoomChat = {
      user_id: session?.user.user_id,
      target_user_id: adminId,
    }
    
    const newChatRoomId = await createNewRoomChat(dataNewRoomChat)
    const data = await fetchUserChats(session?.user.user_id)
    setChats(data)

    const newChat = data.find((chat: { chat_room_id: any }) => chat.chat_room_id === newChatRoomId);
    if (newChat) {
      handleOpenChat(newChat); // Jika Anda memiliki fungsi ini untuk membuka chat
      setCurrentChat(newChat);
  }
};

  return (
    <div className="flex m-2 gap-2">
      {/* Daftar chat */}
      <div className={`relative w-full lg:w-5/12 rounded-lg bg-white overflow-y-scroll h-[85vh] ${isChatOpen ? 'hidden' : ''} lg:block`}>
        <h1 className="text-center text-xl font-semibold">List Chat</h1>
        {chats.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setIsAddChatDialogOpen(!isAddChatDialogOpen)}
            >
              Add New Chat
            </button>
          </div>
        ) : (
          chats.map((chat: { chat_room_id: string, user_id: string, fullname: string, user_image: string }) => (
              <div key={chat.chat_room_id} role="button" className="hover:bg-slate-50" onClick={() => {
                handleOpenChat(chat)
                setCurrentChat(chat)
              }}>
                <Conversation data={chat} />
              </div>
            ))
        )}
        <button
          className="absolute bottom-4 right-4 w-20 h-20 md:w-12 md:h-12 rounded-full bg-blue-500 text-white shadow-xl flex items-center justify-center"
        onClick={() => setIsAddChatDialogOpen(!isAddChatDialogOpen)}
        >
          <FontAwesomeIcon icon={faCommentMedical} className="text-2xl" />
        </button>
        <AddChatDialog isOpen={isAddChatDialogOpen} setIsOpen={setIsAddChatDialogOpen} 
        user_id={session?.user.user_id ?? 0} onSelectAdmin={handleSelectAdmin}/>
      </div>

      {/* Isi chat */}
      <div className={`w-full lg:w-7/12 rounded-lg bg-white h-[85vh] ${isChatOpen ? '' : 'hidden'} lg:block`}>
        <button
          className="lg:hidden px-4 py-2 text-blue-500" 
          onClick={handleBackToConversations}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-base mr-4" />
          Back
        </button>
        <ChatBox
          data={currentChat} currentUser={session?.user.user_id ?? 0}
        />
      </div>
    </div>
  )
}