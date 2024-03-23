'use client'

import { fetchGetMessages } from "@/app/(pages)/api/fetchers/messages";
import { Avatar } from "@mui/material";

interface ConversationProps {
  data: { fullname: string; user_image:string }
  currentUser: number;
}

export default function Conversation ({ data, currentUser}: ConversationProps) {
  
  return (
    <div className="flex gap-2 items-center rounded-lg bg-white m-2 p-2 border">
      <Avatar alt='test' src={data.user_image} sx={{ width: 35, height: 35 }}/>
      <p className="text-lg font-semibold ">{data.fullname}</p>
    </div>
  )
}