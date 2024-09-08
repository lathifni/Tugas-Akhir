import { fetchListAdminChat } from "@/app/(pages)/api/fetchers/chat";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user_id: number;
    onSelectAdmin: (adminId: number) => void;
    // rowDelete: { name: string, id: string };
    // setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: string; } | null>>;
    // onSuccessfulDelete: () => void;
}

interface ListAdmin {
    user_id: number;
    fullname: string;
    user_image: string;
}

export default function AddChatDialog({ isOpen, setIsOpen, user_id, onSelectAdmin, }:Props) {
    const [listAdmin, setListAdmin] = useState<ListAdmin[]>([])
    useEffect(() => {
        const fetchAdminList = async () => {
            const data = await fetchListAdminChat(user_id)
            setListAdmin(data)
            console.log(data);
            
        }
        if(isOpen) {
            fetchAdminList()
        }
    }, [user_id, isOpen])

    const handleSelectAdmin = (adminId: number) => {
        onSelectAdmin(adminId);  // Mengirim user_id ke komponen induk
        setIsOpen(false);  // Menutup dialog setelah memilih admin
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className="p-6">
                <h2 className="text-xl font-semibold text-center mb-4">Select an Admin to Chat</h2>
                {Array.isArray(listAdmin) && listAdmin.length > 0 ? (
                    <ul className="list-none p-0">
                        {listAdmin.map((admin) => (
                            <li
                                key={admin.user_id}
                                className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectAdmin(admin.user_id)}  // Mengirim user_id ketika diklik
                            >
                                <img
                                    src={admin.user_image !== 'default.jpg' ? admin.user_image : '/path/to/default.jpg'}
                                    alt={admin.fullname}
                                    className="w-10 h-10 rounded-full mr-4"
                                />
                                <span className="font-medium">{admin.fullname}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">No admins available to chat.</p>
                )}
                <div className="text-center mt-4">
                    <button
                        className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-blue-400"
                        onClick={() => setIsOpen(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} /> Close
                    </button>
                </div>
            </div>
        </Dialog>
    );
}