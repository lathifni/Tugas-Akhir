'use client'

import { Avatar } from "@mui/material";
import { fetchGetMessages, fetchSendMessage } from "@/app/(pages)/api/fetchers/messages";
import { useEffect, useRef, useState } from "react";
import { format } from 'timeago.js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

interface ChatBoxProps {
  data: { fullname: string; user_image: string, id: number, user_id: string }
  currentUser: number;
  setSendMessage: any;
  receivedMessage: any;
}

interface Message {
  id: string;
  chat_id: number;
  sender_id: number;
  text: string;
  created_at: string;
}

export default function ChatBox({ data, currentUser, setSendMessage, receivedMessage }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("");
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetchGetMessages(data.id)
        setMessages(response)
      } catch (error) {
        console.log(error);
      }
    }
    if (data.id !== 0) fetchMessage()
  }, [data])

  const handleMessageSend = () => {
    // Validasi pesan tidak kosong sebelum mengirim
    if (inputMessage.trim() !== "") {
      // Kirim pesan
      const sendMessageToServer = async () => {
        const receiverId = data.user_id
        const message = {
          chat_id: data.id,
          sender_id: currentUser,
          text: inputMessage,
          created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const messageToServer = await fetchSendMessage(message)
        setMessages([...messages, messageToServer])
        setSendMessage({ ...messageToServer, receiverId });
      }
      sendMessageToServer();
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chat_id === data.id) {
      setMessages([...messages, receivedMessage])
      console.log(receivedMessage, 'ini received message di chatbox nya');
    }
  }, [receivedMessage])

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages])

  return (
    <div>
      {data.id !== 0 ? (
        <div className="">
          <div className="sticky top-0 flex gap-2 items-center rounded-lg p-2 bg-slate-100">
            <Avatar alt='test' src={data.user_image} sx={{ width: 50, height: 50 }} />
            <p className="text-xl font-semibold ">{data.fullname}</p>
          </div>
          <div className="flex flex-col" ref={scroll}>
            {messages.map((message: { sender_id: number, text: string, created_at: string, id: string }) => (
              <div key={message.id} className={`flex ${message.sender_id === currentUser ? 'justify-end ml-[40%]' : 'justify-start mr-[40%]'} bg-blue-600 text-white m-2 p-4 rounded-lg `} >
                <div className="flex flex-col">
                  <p className="">{message.text}</p>
                  <p className={`${message.sender_id === currentUser ? 'text-right' : 'text-left'} font-thin text-sm`}>{format(message.created_at)}</p>
                </div>
              </div>
            ))}
            <div className="sticky buttom-0 bg-slate-200 bottom-0 w-full pt-2">
              <div className="flex">
                <input className="w-full rounded-full h-10 px-4" type="text" placeholder="Write a message"
                  title="write a message" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
                <button className="mx-4 bg-white p-1 rounded-lg" title="send" onClick={handleMessageSend}>
                  <FontAwesomeIcon icon={faPaperPlane} className="w-8 h-7 border-1 text-blue-500" />
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="font-bold text-lg">Tap a Chat to Start a Conversation</p>
        </div>
      )}
    </div>
  )
}