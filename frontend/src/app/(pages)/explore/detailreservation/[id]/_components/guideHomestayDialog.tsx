import { Dialog } from "@mui/material";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: string; } | null>>;
}

export default function GuideHomestayDialog({ isOpen, setIsOpen }: Props) {
  return (
    <Dialog open={isOpen}>
      <div className="flex flex-col px-4 w-full">
        <h1 className="text-3xl text-center font-bold">Reservation Homestay Guide</h1>
        <hr className="border-t-1 border-gray-300" />
        <div className="w-full">
          <h2 className="text-xl text-center font-bold">Homestay Reservation</h2>
          <ul className="list-disc pl-4 font-medium">
            <li>Homestays can be selected according to the user's wishes</li>
            <li>Detailed information on the homestay unit is on the homestay page</li>
            <li>The number of homestay reservation days depends on the number of activity days in the tour package</li>
            <li>If the homestay unit ordered has been booked, a notification 'homestay unit has been booked' will appear when added</li>
            <li>If tourists only want to book a homestay, customize the package by selecting package activities only for the homestay you are visiting</li>
          </ul>
        </div>
        <hr className="border-t-1 border-gray-300" />
        <button className="m-4 px-3 py-2 bg-gray-500 rounded-lg text-white hover:bg-gray-700" onClick={() => setIsOpen(!isOpen)}>Close</button>
      </div>
    </Dialog>
  )
}