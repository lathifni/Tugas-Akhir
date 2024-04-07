'use client'

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

interface Image {
  name: string;
  url: string;
  // size: number;
  file: File;
}

interface FileInputProps {
  onGalleryChange: (newGallery: Image[]) => void;
}

export default function FileInput({ onGalleryChange }: FileInputProps) {
  const [images, setImages] = useState<Image[]>([])
  // const [gallery, setGallery] = useState<any[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const selectFiles = () => {
    // fileInputRef.current.click()
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files == null) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;
      if (!images.some((e: any) => e.name === files[i].name)) {
        setImages((prevImages: any) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            file: files[i]
          }
        ])
      }
    }
    // const newFiles = Array.from(files).filter(file => file.type.startsWith('image'));

    // setGallery(prevGallery => [...prevGallery, ...newFiles]);
  }

  const handleDelete = (index: number) => {
    setImages((prevImages) => {
      return prevImages.filter((_, i) => i !== index)
    })
    // setGallery((prevGallery) => {
    //   return prevGallery.filter((_, i) => i !== index);
    // });
  }

  const onDragOver = (e: any) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: any) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e: any) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].type);
      if (files[i].type.split('/')[0] !== 'image') continue;
      if (!images.some((e: any) => e.name === files[i].name)) {
        setImages((prevImages: any) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i])
          }
        ])
      }
    }
  }

  const sendGalleryToParent = () => {
    onGalleryChange(images);
  }

  useEffect(() => {
    sendGalleryToParent()
  }, [images]);

  return (
    <>
      <div className="bg-gray-100 border-2 border-blue-500 border-dashed rounded-lg">
        <div className="flex justify-center my-2" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
          {isDragging ? (
            <p className="flex justify-center my-8 gap-2">Drop Images Here</p>
          ) : (
            <div className="flex justify-center my-8 gap-2">
              <p className="">Drag & Drop Image Here or</p>
              <label className="underline" htmlFor="fileInput" role="button" onClick={selectFiles}>Browse</label>
            </div>
          )}
          <input type="file" multiple ref={fileInputRef} id="fileInput" onChange={onFileSelect} hidden />
        </div>
        <div className="flex flex-col justify-center items-center p-4">
          {images.map((image: Image, index: number) => (
            <div key={index} className="relative bg-white rounded-lg mb-2">
              <p className="absolute ">{image.name}</p>
              <button className="absolute top-1 right-1 px-3 py-2 bg-red-500 rounded-full text-white" onClick={() => handleDelete(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <img className="p-8" src={image.url} alt={image.name} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}