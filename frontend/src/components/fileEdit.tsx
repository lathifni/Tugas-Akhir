'use client'

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface FileEdit {
  galleries: { url: string }[];
  folder: string;
  onDeleteImage: (url: string) => void;
}

export default function FileEdit({ galleries, folder, onDeleteImage }: FileEdit) {
  const [images, setImages] = useState(galleries)

  const handleDelete = (url: string) => {
    const newImages = images.filter((image) => image.url !== url);
    setImages(newImages);
    onDeleteImage(url);
  };

  if (images) {
    return (
      <>
        <div className="bg-gray-100 border-2 border-blue-500 border-dashed rounded-lg">
          <div className="flex flex-col justify-center items-center p-4">
            {images.length === 0 ? (
              <div className="text-center justify-center">
                <p>There is no galleries saved</p>
              </div>
            ) : (
              images.map((image: { url: string }, index: number) => (
                <div key={index} className="relative bg-white rounded-lg mb-2">
                  <button className="absolute top-1 right-1 px-3 py-2 bg-red-500 rounded-full text-white" onClick={() => handleDelete(image.url)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <img className="p-8" src={`/photos/${folder}/${image.url}`} alt={image.url} />
                </div>
              ))
            )}
          </div>
        </div>
      </>
    )
  }
}