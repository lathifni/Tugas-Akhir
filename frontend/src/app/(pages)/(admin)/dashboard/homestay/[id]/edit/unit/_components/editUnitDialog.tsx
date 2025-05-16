import { fetchAllHomestayTypeUnit } from "@/app/(pages)/api/fetchers/homestay";
import FileEdit from "@/components/fileEdit";
import FileInput from "@/components/fileInput";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

interface Gallery {
  id: string;
  url: string;
}

interface Unit {
  unit_number: string;
  unit_name: string;
  unit_type: string;
  price: number;
  capacity: number;
  description: string;
  galleries: Gallery[]
}

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newFacility: any) => void;
  selectedUnit: Unit | null;
  id: string;
  // data: { id: string, name: string, price: number, category: number }
}
interface Image {
  name: string;
  url: string;
  file: File;
}
const unitSchema = z.object({
  unit_name: z.string().min(1, 'Unit name cannot be empty'),
  type_unit: z.string().min(1, 'Type unit cannot be empty'),
  price: z.string().min(1, 'Price cannot be empty'),
  capacity: z.string().min(1, 'Minimum capacity cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  // gallery: z.array(z.object({
  //   file: z.any(), // You can customize this if needed
  // })).min(1, 'At least one gallery image is required'),
});

export default function EditUnitDialog({ isOpen, setIsOpen, id, onSave, selectedUnit, }: Props) {
  const [gallery, setGallery] = useState<Image[]>([]);
  const [error, setError] = useState<string>('');
  const [deletedGalleryUrls, setDeletedGalleryUrls] = useState<string[]>([]);
  
  const [formDataInput, setFormDataInput] = useState({
    unit_name: "",
    type_unit: "",
    capacity: "",
    price: "",
    description: ""
  });

  useEffect(() => {
    if (selectedUnit) {
      setFormDataInput({
        unit_name: selectedUnit.unit_name || "",
        type_unit: selectedUnit.unit_type || "",
        capacity: selectedUnit.capacity?.toString() || "",
        price: selectedUnit.price?.toString() || "",
        description: selectedUnit.description || ""
      });
    }
  }, [selectedUnit]);

  const { data, isLoading } = useQuery({
    queryKey: ['allHomestayTypeUnit',],
    queryFn: () => fetchAllHomestayTypeUnit(),
    // staleTime: 10000
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormDataInput({ ...formDataInput, [name]: value });
  };
  
  const handleGalleryChange = (newGallery: any) => {
    setGallery(newGallery);
  }

  const handleSave = async () => {    
    const validation = unitSchema.safeParse({
      unit_name: formDataInput.unit_name,
      type_unit: formDataInput.type_unit,
      price: formDataInput.price,
      capacity: formDataInput.capacity,
      description: formDataInput.description,
    })
    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        setError(err.message);
      });
      return;
    }
    const category = 'homestay'
    let responseGallery
    if (gallery.length > 0) {
      const formDataGallery = new FormData()
      formDataGallery.append('category', category)
      gallery.forEach((image, index) => {
        formDataGallery.append(`images[${index}]`, image.file);
      });
      responseGallery = await axios.post("/api/images", formDataGallery);
    }

    try {
      const urlGallery = responseGallery?.data.data
      const data = {
        ...validation.data,
        gallery: urlGallery,
        homestay_id: id,
        unit_number: selectedUnit!.unit_number,
        urlGallery,
        delete_gallery: deletedGalleryUrls,
      };
      onSave(data);
      setDeletedGalleryUrls([])
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
    setGallery([]); 
    setIsOpen(false);
  };

  const handleDeleteGallery = (url: string) => {
    setDeletedGalleryUrls([...deletedGalleryUrls, url]);
  };
  
  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <h3 className="text-center ">Edit Unit Homestay</h3>
      <DialogContent dividers>
        <div className="m-4">
          <label>Unit Name</label>
          <input type="text" name='unit_name'
          onChange={handleChange}
          //  onChange={(e) => {
          //   handleChange
          //   setError('');
          // }}
          value={formDataInput.unit_name}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Type Unit</label>
          {data ? (
          <select
            name="type_unit"
            onChange={handleChange}
            value={formDataInput.type_unit}
            className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Please choose</option>
            {data.map((data: { id: string; name_type: string }) => (
              <option key={data.id} value={data.id}>
                {data.name_type}
              </option>
            ))}
          </select>
          ) : (
            <input type="text" readOnly placeholder="Loading ..." className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          )}
        </div>
        <div className="m-4">
          <label>Capacity</label>
          <input type="number" name='capacity'
          onChange={handleChange}
          value={formDataInput.capacity}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Price</label>
          <input type="number" name='price'
          onChange={handleChange}
          value={formDataInput.price}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Description</label>
          <textarea id="message" name='description' 
          onChange={handleChange}
          value={formDataInput.description}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write description here..."></textarea>
        </div>
        <div className="m-4">
          <label >Gallery Saved</label>
          {selectedUnit && (
            <FileEdit
              galleries={selectedUnit.galleries} 
              folder="homestay" 
              onDeleteImage={handleDeleteGallery} 
              fileType={"image"} 
            />
          )}
        </div>
        <div className="m-4">
          <label>Gallery</label>
          <FileInput onGalleryChange={handleGalleryChange} fileType={"image"} />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </DialogContent>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" onClick={handleSave}>
          <FontAwesomeIcon icon={faCheck} /> Save
        </button>
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
      </div>
    </Dialog>
  )
}