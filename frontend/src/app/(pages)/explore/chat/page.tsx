'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { fetchUserChats } from "../../api/fetchers/chat"
import Conversation from "./_components/conversation"
import ChatBox from "./_components/chatBox"
import { io } from 'socket.io-client'

interface ChatData {
  fullname: string;
  user_image: string;
  id: number;
  user_id: string
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [chats, setChats] = useState([])
  const [currentUser, setCurrentUser] = useState<number | null>(null);
  const [currentChat, setCurrentChat] = useState<ChatData>({ fullname: '', user_image: '', id: 0, user_id: '0' })
  const [socket, setSocket] = useState<any>(undefined)
  const [sendMessage, setSendMessage] = useState(null)
  const [receivedMessage, setReceivedMessage] = useState(null);

  useEffect(() => {
    const getChats = async () => {
      try {
        if (session) {
          setCurrentUser(session.user.user_id)
          const data = await fetchUserChats(1)
          setChats(data)
          setCurrentUser(session.user.user_id)

          const socket = io('ws://localhost:3002')
          socket.emit('new-user-add', currentUser)
          setSocket(socket)

          socket.on('recieve-message', (data: any) => {
            setReceivedMessage(data)
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
    getChats()
  }, [session])

  useEffect(() => {
    if (sendMessage !== null) {
      socket.emit('send-message', sendMessage)
    }
  }, [sendMessage])

  return (
    <div className="flex m-2 gap-2">
      {/* Daftar chat */}
      <div className="w-full sm:w-5/12 rounded-lg bg-white overflow-y-scroll">
        <h1 className="text-center text-xl font-semibold">List Chat</h1>
        {chats.filter((chat: { user_id: number }) => chat.user_id !== currentUser)
          .map((chat: { id: number, user_id: string, fullname: string, user_image: string }) => (
            <div key={chat.id} role="button" onClick={() => setCurrentChat(chat)}>
              <Conversation
                data={chat}
                currentUser={currentUser ?? 0}
              />
            </div>
          ))
        }
      </div>

      {/* Isi chat */}
      <div className="hidden sm:block w-7/12 rounded-lg bg-white overflow-y-scroll max-h-[900px]">
        <ChatBox
          data={currentChat} currentUser={currentUser ?? 0}        //  currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  )
}