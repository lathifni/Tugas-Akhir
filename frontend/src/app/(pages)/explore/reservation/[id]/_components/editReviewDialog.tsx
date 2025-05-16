import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Rating from "@mui/material/Rating"; // Import Rating
import { useEffect, useState } from "react"; // Import useState

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newReview: any) => void; // Adjust parameter name
  data: { rating:number, review:string }
}

export default function EditReviewDialog({ isOpen, setIsOpen, onSave, data }: Props) {
  const [ratingValue, setRatingValue] = useState<number | null>(data.rating); // Initialize with passed rating
  const [review, setReview] = useState<string>(data.review); // Initialize with passed review
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setRatingValue(data.rating);
    setReview(data.review);
  }, [data]);

  const handleSave = () => {
    if (ratingValue === null) {
      return setError('Please provide a rating.');
    }
    if (review == '') {
      return setError('Please provide a review.');
    }

    const newReview = {
      rating: ratingValue,
      review: review,
    };

    onSave(newReview);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <h3 className="text-center">Edit Review</h3>
      <DialogContent dividers>
        <div className="text-center">
          <Rating
            name="rating"
            value={ratingValue}
            className="text-lg"
            onChange={(event, newValue) => setRatingValue(newValue)} // Handle rating change
          />
        </div>
        <div className="mt-4">
          <textarea
            placeholder="Leave a comment or review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={6}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </DialogContent>
      <div className="text-center">
        <button
          className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
        <button
          className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400"
          onClick={handleSave}
        >
          <FontAwesomeIcon icon={faCheck} /> Save
        </button>
      </div>
    </Dialog>
  );
}
