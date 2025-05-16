'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface GalleryData {
  type: string;
  urls: { url: string }[];
}

export default function Galleries({ urls, type }: GalleryData) {  
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % urls.length);
  };

  return (
    <>
      <div className="flex justify-center items-center flex-wrap">
        {urls.map((item, index) => (
          <Image
            key={index}
            src={`/photos/${type}/${item.url}`} // Adjust path as needed
            alt={`Photo ${index + 1}`}
            className="p-2 rounded-sm cursor-pointer"
            width={110}
            height={110}
            objectFit="cover"
            onClick={() => openModal(index)}
          />
        ))}
      </div>
      <Dialog open={isOpen}>
        <div className="relative bg-white py-8 px-4">
          <Image
            src={`/photos/${type}/${urls[currentImageIndex].url}`}
            alt={`Photo ${currentImageIndex + 1}`}
            width={400}
            height={400}
            objectFit="contain"
          />
            <button className="absolute top-0 right-0 p-2" onClick={closeModal}>
              <FontAwesomeIcon icon={faXmark} className="text-red-600 text-2xl rounded-2xl hover:text-red-700"/>
            </button>
          </div>
      </Dialog>
    </>
  )
}