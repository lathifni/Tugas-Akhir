'use client'

import { Avatar } from "@mui/material";
import { fetchGetMessages, fetchSendMessage, fetchStatusMessage } from "@/app/(pages)/api/fetchers/messages";
import { useEffect, useRef, useState } from "react";
import { format } from 'timeago.js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faCheckDouble, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";

interface ChatBoxProps {
  data: { chat_room_id: string, fullname: string; user_image: string, user_id: string }
  currentUser: number;
}

interface Message {
  chat_room_id: string;
  sender_id: number;
  text: string;
  created_at: string;
  is_read: number;
}

export default function ChatBox({ data, currentUser  }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<any>(undefined)
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io('ws://localhost:3002')
    socket.emit('join-room', data.chat_room_id);
    setSocket(socket)

    const fetchMessage = async () => {
      try {
        const response = await fetchGetMessages(data.chat_room_id)
        setMessages(response)
        updateStatusMessage(data.chat_room_id)
      } catch (error) {
        console.log(error);
      }
    }
    if (data.chat_room_id !== '0') fetchMessage()

    return () => {
      socket.disconnect(); // Pastikan socket terputus untuk menghindari kebocoran
    };
  }, [data])

  useEffect(() => {
    if (socket) {
      socket.emit('read-all-messages', data.chat_room_id)

      socket.on('receive-message', (message:any) => {
        setReceivedMessage(message);
      });

      socket.on('is-read-notification', (updateMessage: any) => {
        setMessages(prevMessages =>
          prevMessages.map(message =>
            message.created_at === updateMessage.created_at
              ? { ...message, is_read: 1 }
              : message
          )
        );
      });

      socket.on('read-all-messages-notification', () => {
        setMessages(prevMessages =>
        prevMessages.map(message =>
          message.is_read === 0 // Hanya update pesan yang belum dibaca
            ? { ...message, is_read: 1 }
            : message
          )
        );
      })
  
      return () => {
        socket.off('receive-message'); // Bersihkan listener untuk menghindari duplikasi
        socket.off('is-read-notification');
        socket.off('read-all-messages-notification');
      };
    }
  }, [socket]);

  const handleMessageSend = () => {
    // Validasi pesan tidak kosong sebelum mengirim
    if (inputMessage.trim() !== "") {
      const sendMessageToServer = async () => {
        const message = {
          chat_room_id: data.chat_room_id,
          text: inputMessage,
          sender_id: currentUser,
          is_read: 0, 
          receiver_id: data.user_id,
        }
        const messageToServer = await fetchSendMessage(message)
        setMessages([...messages, messageToServer])
        socket.emit('send-message', messageToServer);
      }
      sendMessageToServer();
      setInputMessage("");
    }
  };

  const updateStatusMessage = async(params: any) => {    
    await fetchStatusMessage(params)
  }

  useEffect(() => {
    if (receivedMessage !== null && messages) {
      setMessages([...messages, receivedMessage])
      socket.emit('is-read', receivedMessage)
      updateStatusMessage(data.chat_room_id)
    }
  }, [receivedMessage])
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]); 

  return (
  <div className="relative h-full grid grid-rows-[auto_1fr_auto] overflow-auto" ref={scrollRef}>
    {data.chat_room_id !== '0' ? (
      <>
        <div className="sticky top-0 flex gap-2 items-center rounded-lg p-1 bg-slate-100 z-10">
          {/* <button className="block sm:hidden">
            <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
          </button> */}
          <Avatar alt='test' src={data.user_image} sx={{ width: 50, height: 50 }} />
          <p className="text-xl font-semibold">{data.fullname}</p>
        </div>
        <div className="flex flex-col " >
          {messages.map((message) => (
            <div
              key={message.created_at}
              className={`flex ${message.sender_id === currentUser ? 'justify-end ml-[40%]' : 'justify-start mr-[40%]'} bg-blue-600 text-white m-2 p-4 rounded-lg shadow-lg`}
            >
              <div className="flex flex-col">
                <p>{message.text}</p>
                <div className={`flex items-center ${message.sender_id === currentUser ? 'justify-end' : 'justify-start'} font-thin text-sm`}>
                  <p>{format(message.created_at)}</p>
                  {message.sender_id === currentUser && (
                    <div className="ml-2">
                      {message.is_read === 0 ? (
                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                      ) : (
                        <FontAwesomeIcon icon={faCheckDouble} className="text-xs" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-slate-200 w-full pt-2">
          <div className="flex">
            <input
              className="w-full rounded-full h-10 px-4"
              type="text"
              placeholder="Write a message"
              title="write a message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              className="mx-4 bg-white p-1 rounded-lg"
              title="send"
              onClick={handleMessageSend}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-8 h-7 border-1 text-blue-500" />
            </button>
          </div>
        </div>
      </>
    ) : (
      <div className="flex h-full items-center justify-center">
        <p className="font-bold text-lg">Tap a Chat to Start a Conversation</p>
      </div>
    )}
  </div>
);
}