import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  totalRefund: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newData: any) => void;
}

export default function RefundDepositDialog({ isOpen, setIsOpen, onSave, totalRefund, }: Props) {
  const [error, setError] = useState<string>('');
  const [bank, setBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  
 const handleSave = () => {
    // Validate input fields
    if (!bank.trim()) {
      setError('Please provide a bank name.');
      return;
    }
    if (!accountNumber.trim()) {
      setError('Please provide account number.');
      return;
    }
    if (!owner.trim()) {
      setError('Please provide a owner name.');
      return;
    }

    const data = {
      bank,
      accountNumber,
      owner,
      totalRefund
    };
    
    onSave(data); // Pass data to onSave function
    setIsOpen(false); // Close dialog
  };

  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <h3 className="text-center mx-4">Cancel & Refund Deposit Submit</h3>
      <DialogContent dividers>
      <div className="m-4">
        <label>Total Refund</label>
        <div 
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        >
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR',minimumFractionDigits: 0 }).format(totalRefund)}
        </div>
      </div>
        <div className="m-4">
          <label>Bank</label>
          <input id="message" name='bank' 
            value={bank}
            onChange={(e) => {
              setBank(e.target.value);
              setError(''); // Hapus pesan kesalahan saat mengetik deskripsi
            }}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="BCA, BNI, BRI, Mandiri, etc"></input>
        </div>
        <div className="m-4">
          <label>No Account</label>
          <input id="message" name='no_account' 
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              setError(''); // Hapus pesan kesalahan saat mengetik deskripsi
            }}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Your Bank Account Number"></input>
        </div>
        <div className="m-4">
          <label>Owner Account</label>
          <input id="message" name='owner_account' 
            value={owner}
            onChange={(e) => {
              setOwner(e.target.value);
              setError(''); // Hapus pesan kesalahan saat mengetik deskripsi
            }}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Budi Sudarsono"></input>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </DialogContent>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" onClick={() => handleSave()}>
          <FontAwesomeIcon icon={faCheck} /> Save
        </button>
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
      </div>
    </Dialog>
  )
}