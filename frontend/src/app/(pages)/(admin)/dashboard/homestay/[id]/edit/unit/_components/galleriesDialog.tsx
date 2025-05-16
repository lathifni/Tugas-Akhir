import { faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUnitGallery: { url: string, id:string }[] | null;
}

export default function GalleriesDialog ({ isOpen, setIsOpen, selectedUnitGallery }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (selectedUnitGallery) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedUnitGallery.length);
    }
  };

  const handlePrev = () => {
    if (selectedUnitGallery) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? selectedUnitGallery.length - 1 : prevIndex - 1
      );
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <div className="relative text-center">
        <h3 className="text-center ">Galleries Unit</h3>
        <button className="absolute right-0 top-0 px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <DialogContent dividers>
        {selectedUnitGallery && selectedUnitGallery.length > 0 && (
          <div className="flex flex-col items-center">
            <img
              src={`/photos/homestay/${selectedUnitGallery[currentIndex].url}`}
              alt="Gallery Image"
              className="mb-4 w-full max-h-[70vh] object-contain"
            />
            <div className="flex justify-center mb-4">
              {selectedUnitGallery.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${index === currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
            <div className="flex justify-between w-full px-4">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                onClick={handlePrev}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                onClick={handleNext}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
      
    </Dialog>
  )
}