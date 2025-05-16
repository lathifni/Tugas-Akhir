import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: { id: string, name: string, price: number, category: number }
}

export default function EditDialogService({ isOpen, setIsOpen, data }: Props) {
  return (
    <Dialog open={isOpen}>
      <div className="px-10 py-2">
        <h1 className="text-3xl text-center font-semibold">Edit Service</h1>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-900 ">Id</label>
          <input type="text" name='fullname' defaultValue={data.id} className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" readOnly/>
        </div>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-900 ">Name</label>
          <input type="text" name='fullname' defaultValue={data.name} className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-900 ">Price</label>
          <input type="text" name='fullname' defaultValue={data.price} className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-900 ">Category</label>
          <RadioGroup
            row
            defaultValue={data.category === 0 ? 0 : 1}
          >
            <FormControlLabel value="0" control={<Radio />} label="Group" />
            <FormControlLabel value="1" control={<Radio />} label="Individu" />
          </RadioGroup>
        </div>
      </div>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400">
          <FontAwesomeIcon icon={faCheck} /> Submit
        </button>
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
      </div>
    </Dialog>
  )
}