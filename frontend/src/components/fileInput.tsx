'use client'

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

interface ImageVideo {
  name: string;
  url: string;
  // size: number;
  file: File;
}

interface FileInputProps {
  onGalleryChange: (newGallery: ImageVideo[]) => void;
  fileType: 'image' | 'video';
}

export default function FileInput({ onGalleryChange, fileType  }: FileInputProps) {
  const [imagesVideos, setImagesVideos] = useState<ImageVideo[]>([])
  // const [gallery, setGallery] = useState<any[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files == null) return;
    
    const fileTypeAllowed = fileType
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== `${fileTypeAllowed}`) continue;
      if (!imagesVideos.some((e: any) => e.name === files[i].name)) {
        setImagesVideos((prevImages: any) => [
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
    setImagesVideos((prevImages) => {
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
      if (!imagesVideos.some((e: any) => e.name === files[i].name)) {
        setImagesVideos((prevImages: any) => [
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
    onGalleryChange(imagesVideos);
  }

  useEffect(() => {
    sendGalleryToParent()
  }, [imagesVideos]);

  return (
    <>
      <div className="bg-gray-100 border-2 border-blue-500 border-dashed rounded-lg">
        <div className="flex justify-center my-2" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
          {isDragging ? (
            <p className="flex justify-center my-8 gap-2">Drop Images Here</p>
          ) : (
            <div className="flex justify-center my-8 gap-2">
              <p>Drag & Drop {fileType === 'image' ? 'Image' : 'Video'} Here or</p>
              {/* <label className="underline" htmlFor="fileInput" role="button" onClick={selectFiles}>Browse</label> */}
              <div className="underline" role="button" onClick={selectFiles}>Browse</div>
            </div>
          )}
          <input type="file" multiple ref={fileInputRef} id="fileInput" onChange={onFileSelect} hidden />
        </div>
        <div className="flex flex-col justify-center items-center p-4">
          {imagesVideos.map((imagesVideos: ImageVideo, index: number) => (
            <div key={index} className="relative bg-white rounded-lg mb-2">
              <p className="absolute ">{imagesVideos.name}</p>
              <button className="absolute top-1 right-1 px-3 py-2 bg-red-500 rounded-full text-white" onClick={() => handleDelete(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              {/* <img className="p-8" src={image.url} alt={image.name} /> */}
              {fileType === 'image' ? (
              <img className="p-8" src={imagesVideos.url} alt={imagesVideos.name} />
              ) : (
                <video className="p-8" controls>
                  <source src={imagesVideos.url} />
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}