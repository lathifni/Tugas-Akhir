import { Dialog } from "@mui/material";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: string; } | null>>;
}

export default function AddDialogFacility({ isOpen, setIsOpen, setNotification }: Props) {
  return (
    <Dialog open={isOpen}>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-3 mb-3 lg:p-0 lg:mb-0 lg:mr-3 lg:w-2/3 bg-gray-100 rounded-lg">
          <h1 className="text-3xl text-center font-bold">Add Facility</h1>
          <div>
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Name</label>
            <input type="text" name='name' 
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
        </div>
        <div className="py-5 flex flex-col lg:w-1/3 items-center bg-gray-100 rounded-lg">
          <p>test lagi</p>
        </div>
      </div>
    </Dialog>
  )
}