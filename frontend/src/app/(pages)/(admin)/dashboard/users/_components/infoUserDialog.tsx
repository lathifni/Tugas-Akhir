import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataUser: any;
}

export default function InfoUserDialog({ isOpen, setIsOpen, dataUser, }: Props) {
  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "35%", maxWidth: "none" } }}>
      <h3 className="text-center ">Detail Profile User</h3>
      <DialogContent dividers>
        <div className="flex justify-center mb-4">
          <Avatar 
            alt={dataUser?.fullname || 'User Avatar'} 
            src={dataUser?.user_image && dataUser.user_image !== 'default.jpg' 
              ? dataUser.user_image  // Jika bukan default, tampilkan link user_image
              : '/photos/user.jpg' // Jika default, tampilkan gambar default
            }
            sx={{ width: 100, height: 100 }} 
          />
        </div>
        <div className="mb-4">
          <strong>Id :</strong> <p>{dataUser?.id}</p>
        </div>
        <div className="mb-4">
          <strong>Full Name :</strong> <p>{dataUser?.fullname}</p>
        </div>
        <div className="mb-4">
          <strong>Address :</strong> <p>{dataUser?.address ?? 'N/A'}</p>
        </div>
        <div className="mb-4">
          <strong>Phone :</strong> <p>{dataUser?.phone ?? 'N/A'}</p>
        </div>
        <div className="mb-4">
          <strong>Code Referral :</strong> <p>{dataUser?.code_referral ?? 'N/A'}</p>
        </div>
        <div className="mb-4">
          <strong>Account Referral :</strong> <p>{dataUser?.account_referral ?? 'N/A'}</p>
        </div>
      </DialogContent>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Close
        </button>
      </div>
    </Dialog>
  )
}