'use client'

import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { Skeleton } from "./skeleton";

interface itemProps {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
  expanded: boolean;
  onExpand: () => void;
  level: number;
}

export default function Item({
  label, 
  onClick,
  icon: Icon,
  expanded,
  onExpand,
  level = 0,
}: itemProps) {
  const ChevronIcon = expanded? ChevronDown: ChevronRight

  

  return (
    <div
    onClick={onClick}
    role="button"
    style={{ 
      paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
    }}
    className="group min-h-[27px] text-sm py-1 pr-3 w-full flex items-center font-medium hover:bg-slate-300"
    >
      <Icon className="shrink-0 h-[18px] mr-2"/>
      <span className="truncate">
      {label}
      </span>
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}