'use client'

import { ChevronsLeft, MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import NavigationHeader from './navigationHeader'
import NavigationItemAdmin from './navigationItemAdmin'

export default function NavigationAdmin() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sideBarRef = useRef<ElementRef<"aside">>(null);
  const navBarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sideBarRef.current.style.width = isMobile ? "100%" : "288px";
      navBarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navBarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sideBarRef.current.style.width = "0";
      navBarRef.current.style.setProperty("width", "50%");
      navBarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  return (
    <>
      <aside
        ref={sideBarRef}
        className='w-0 group/sidebar min-h-screen bg-secondary overflow-y-auto relative flex lg:w-72 lg:block flex-col z-[99999] transition-all ease-in-out duration-300 bg-blue-500'
        //di bawah ini class yang lamanya
        // className='w-0 group/sidebar h-full bg-secondary overflow-y-auto relative flex lg:w-72 lg:block flex-col z-[99999] transition-all ease-in-out duration-300 bg-blue-500'
      >
        <div
          onClick={collapse}
          role="button"
          className='h-6 w-6 text-muted-foreground rounded-lg hover:bg-slate-300 absolute top-3 right-2 group-hover/sidebar:opacity-100 transition md:hidden'
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <NavigationHeader />
        <NavigationItemAdmin />
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="group-hover/sidebar:bg-slate-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navBarRef}
        className='absolute top-0 z-[99998] left-0 w-full md:hidden'
      >
        <nav className="flex bg-transparent px-3 py-2 w-full">
          <MenuIcon onClick={resetWidth} role="button" className="h-8 w-8" /> 
        </nav>
      </div>
    </>
  )
}