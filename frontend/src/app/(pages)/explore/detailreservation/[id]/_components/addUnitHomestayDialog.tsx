import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: string; } | null>>;
}

export default function AddUnitHomestayDialog({ isOpen, setIsOpen }: Props) {
  return (
    <Dialog open={isOpen}>
      <div className="px-4 w-full">
        <h1 className="text-3xl text-center font-bold">Add Unit Homestay</h1>
        <hr className="border-t-1 border-gray-300" />
        <label className="block mt-2 text-sm font-medium text-gray-900 ">Unit Homestay</label>
        <select
          name="type"
          // value={formDataInput.type}
          // onChange={handleChange}
          className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="">Please choose unit</option>
          <option value="">1 choose</option>
          <option value="">2 choose</option>
          {/* {dataAllTypeFacility.map((service: { id: string; type: string }) => (
            <option key={service.id} value={service.id}>
              {service.type}
            </option>
          ))} */}
        </select>
        <hr className="border-t-1 border-gray-300" />
        <div className="flex m-4 justify-end gap-4">
          <button className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white" onClick={() => setIsOpen(!isOpen)}>Cancel</button>
          <button className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"><FontAwesomeIcon icon={faAdd} /> Add</button>
        </div>
      </div>
    </Dialog>
  )
}