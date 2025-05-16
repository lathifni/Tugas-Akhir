'use client'

import { fetchReservationById } from "@/app/(pages)/api/fetchers/reservation";
import { Accordion, AccordionDetails, AccordionSummary, Rating } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { fetchBookedHomestay } from "@/app/(pages)/api/fetchers/homestay";
import ReviewDialog from "./_components/reviewDialog";
import useAxiosAuth from "../../../../../../libs/useAxiosAuth";
import { Bounce, toast, ToastContainer } from "react-toastify";
import EditReviewDialog from "./_components/editReviewDialog";
import RefundDialog from "./_components/refundDialog";
import RefundConfirmationDialog from "./_components/refundConfirmationDialog";
import RefundDepositDialog from "./_components/refundDepositDialog";
import CancelDialog from "./_components/cancelDialog";
import Link from "next/link";

interface Activity {
  day: string;
  activity: string;
  activity_name: string;
}

// interface ReservationData {
//   activity: Activity[];
// }

export default function ReservationIdPage({ params }: any) {
  const [dataActivity, setDataActivity] = useState<{ day: string; activities: Activity[] }[]>([]);
  const [token, setToken] = useState('')
  const [totalPriceHomestay, setTotalPriceHomestay] = useState(0)
  const [reviewIsOpen, setReviewIsOpen] = useState(false)
  const [refundIsOpen, setRefundIsOpen] = useState(false)
  const [cancelIsOpen, setCancelIsOpen] = useState(false)
  const [refundDepositIsOpen, setRefundDepositIsOpen] = useState(false)
  const [refundProofIsOpen, setRefundProofIsOpen] = useState(false)
  const [editReviewIsOpen, setEditReviewIsOpen] = useState(false)
  const steps = ['Waiting Confirmation Date', 'Deposit', 'Full Payment', 'Enjoy Trip'];
  const getStatusStep = () => {
    switch (dataReservationById.reservation.status_id) {
      case 1:
        return 0; // Langkah 1: Deposit
      case 2:
        return 1; // Langkah 2: Full Payment
      case 3:
        return 2; // Langkah 3: Enjoy Trip
      case 4:
        return 4
      default:
        return -1; // Status tidak valid, tampilkan semua langkah
    }
  };
  const now = moment();

  const { data: dataReservationById, isLoading: loadingReservation, refetch } = useQuery({
    queryKey: ['reservationbyId', params.id],
    queryFn: () => fetchReservationById(params.id),
    // staleTime: 10000
  })
  const { data: dataBookedHomestay, isLoading: loadingBookedHomestay } = useQuery({
    queryKey: ['bookedHomestay', params.id],
    queryFn: () => fetchBookedHomestay(params.id),
    // staleTime: 10000
  })
  console.log(dataReservationById);
  

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  const payNowButtonHandler = () => {
    setToken(dataReservationById.reservation.token_midtrans)

    if (token) {
      window.snap.pay(token, {
        onSuccess: (result: any) => {
          console.log(result, 'di onSuccess');
          setToken('')
        },
        onPending: (result: any) => {
          console.log(JSON.stringify(result), 'di onPending');
          setToken('')
        },
        onError: (error: any) => {
          console.log(error);
        },
        onClose: () => {
          console.log('di close Anda belum menyelesaikan pembayaran')
        }
      })
    }
  }

  useEffect(() => {
    try {
      if (dataReservationById  && dataBookedHomestay) {
        const groupedData: { [key: string]: Activity[] } = {};
        dataReservationById.activity.forEach((activity: Activity) => {
          if (!groupedData[activity.day]) {
            groupedData[activity.day] = [];
          }
          groupedData[activity.day].push(activity);
        });
  
        const accordionContent = Object.entries(groupedData).map(([day, activities]: [string, Activity[]]) => ({
          day,
          activities: activities.sort((a, b) => parseInt(a.activity) - parseInt(b.activity))
        }));

        setTotalPriceHomestay(dataBookedHomestay.reduce((total:number, homestay:any) => total + homestay.price, 0))        
        setDataActivity(accordionContent);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dataReservationById, dataBookedHomestay])

  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;

    scriptTag.setAttribute('data-client-key', process.env.MIDTRANS_CLIENT_KEY!);
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    }
  }, []);

  const handleReviewSaved = async(data: any) => {
    console.log(data);
    data.id = params.id
    const response = await useAxiosAuth.post('reservation/review', data)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
      // toast.warning(response.data.message)
  }

  const downloadInvoiceHandler = async() => {
    try {
      const response = await useAxiosAuth.post('reservation/invoice', {
        dataReservationById, dataBookedHomestay
      }, {
        responseType: 'blob', // Important to handle it as binary data
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = url;
      link.download = 'invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  }

  const refundOnSave = async(data:any) => {
    console.log(data);
    
    data.id = params.id
    const response = await useAxiosAuth.post('reservation/refund', data)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
      // toast.warning(response.data.message)
  }

  const cancelOnSave = async(data:any) => {
    data.id = params.id
    const response = await useAxiosAuth.post('reservation/cancel', data)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
  }

  const refundConfirmationSave = async(data:any) => {
    data.id = params.id
    const response = await useAxiosAuth.put('reservation/refund/confirmation', data)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
  }

  if (dataReservationById && dataBookedHomestay) {
    const activeStep = getStatusStep();
    return (
      <div className="flex flex-col xl:flex-row m-1 sm:m-3 lg:m-4">
        <div className="w-full h-full px-1 xl:w-1/2">
          {dataReservationById && (
            <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
              <div id="snap-container"></div>
              <h1 className="text-center text-xl font-bold">Reservation Package</h1>
              <table className="w-full mt-5 text-lg">
                <tbody>
                  <tr className="">
                    <td className="font-semibold whitespace-no-wrap">Package Name </td>
                    <td>{dataReservationById.reservation.name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Package Type </td>
                    <td>{dataReservationById.reservation.type_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Request Date </td>
                    <td>{moment(dataReservationById.reservation.request_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Days Package </td>
                    {dataReservationById.reservation.max_day > 1 ? (
                      <td>{dataReservationById.reservation.max_day} Days</td>
                    ) :
                      <td>{dataReservationById.reservation.max_day} Day</td>}
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Check-in </td>
                    {/* <td>{new Date(dataReservationById.reservation.check_in).toDateString()}</td> */}
                    <td>{moment(dataReservationById.reservation.check_in).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Check-out </td>
                    <td>
                      {(() => {
                        const checkInDate = moment(dataReservationById.reservation.check_in);
                        const checkOutDate = checkInDate.clone(); // Clone checkInDate to prevent mutation

                        if (dataReservationById.reservation.max_day > 1) {
                          checkOutDate.add(dataReservationById.reservation.max_day - 1, 'days').set({ hour: 12, minute: 0, second: 0 }); // Set checkout time to 12:00 PM
                        } else {
                          checkOutDate.set({ hour: 18, minute: 0, second: 0 }); // Set checkout time to 6:00 PM
                        }
                        return `${checkOutDate.format('dddd, Do MMMM  YYYY')}, ${checkOutDate.format('HH:mm')}`;
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Total People </td>
                    <td>{dataReservationById.reservation.total_people} People</td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Base Price Package </td>
                    <td>{rupiah(dataReservationById.reservation.price)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Price Total </td>
                    <td>{rupiah(dataReservationById.reservation.total_price)}
                      <span className="italic text-slate-600"> *Based on the activities and services added</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Rating </td>
                    <td>
                      {dataReservationById.reservation.rating > 0 ? (
                         <Rating
                         name="read-only-rating"
                         value={dataReservationById.reservation.rating}
                         readOnly
                       />
                      ) : (
                        <span className="italic text-slate-500">No rating given</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold whitespace-no-wrap">Review </td>
                    <td>
                      {dataReservationById.reservation.review ? (
                        dataReservationById.reservation.review
                      ) : (
                        <span className="italic text-slate-500">No review provided</span>
                      )}
                    </td>
                  </tr>
                  <tr className="w-fit">
                    <td className="font-semibold whitespace-no-wrap">Status </td>
                    <td className="font-semibold">{dataReservationById.reservation.status}</td>
                  </tr>
                  {now.diff(dataReservationById.reservation.request_date, 'hours')<24 && dataReservationById.reservation.status_id === 2 ? (
                    <tr>
                      <td className="font-semibold whitespace-no-wrap"></td>
                      <td>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700" onClick={payNowButtonHandler}>Pay Deposit Now</button>
                      </td>
                    </tr>
                  ): null}
                  {now.diff(dataReservationById.reservation.deposit_date, 'hours')<24 && dataReservationById.reservation.status_id === 3 ? (
                    <tr>
                      <td className="font-semibold whitespace-no-wrap"></td>
                      <td>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700" onClick={payNowButtonHandler}>Pay Full Payment Now</button>
                      </td>
                    </tr>
                  ): null}
                </tbody>
              </table>
              {(dataReservationById.reservation.status_id == 8 
              && dataReservationById.reservation.proof_refund != null
              && dataReservationById.reservation.refund_check == null) && (
                <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                  onClick={() => setRefundProofIsOpen(true)}>Refund Proof / Check</button>
              )}
              <div className="py-2">
                {dataReservationById.reservation.rating > 0 ? (
                  // If rating exists, show Edit Review button
                  <button 
                    className="px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-700"
                    onClick={() => setEditReviewIsOpen(true)}
                  >
                    Edit Review
                  </button>
                ) : (
                  // If no rating, and status_id is 4, show Review button
                  dataReservationById.reservation.status_id === 4 && (
                    // <button 
                    //   className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                    //   onClick={() => setReviewIsOpen(true)}
                    // >
                    //   Review
                    // </button>
                    <Link href={`/explore/reservation/${params.id}/review`}>
                      <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700">
                        Review
                      </button>
                    </Link>
                  )
                )}
              </div>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Accordion className="mt-4">
                <AccordionSummary expandIcon={<ChevronDown />} className=" rounded-lg font-semibold mt-3">
                  Payment Detail
                </AccordionSummary>
                <AccordionSummary>
                  <div>
                    {dataReservationById.reservation.payment_date != null && (
                      <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                      onClick={()=> downloadInvoiceHandler()}
                      >Download Invoice</button>
                    )}
                    <table className="ml-2">
                      <tbody>
                      <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">Total Reservation Amount</td>
                          <td className="font-normal">
                            {rupiah(dataReservationById.reservation.total_price+totalPriceHomestay)}
                          </td>
                        </tr>
                        <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">Deposit Reservation</td>
                          <td className="font-normal">
                            {rupiah(dataReservationById.reservation.deposit)}
                          </td>
                        </tr>
                        <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">Deposit Date</td>
                          <td className="font-normal">
                            {dataReservationById.reservation.deposit_date ? (
                              moment(dataReservationById.reservation.deposit_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')
                            ) : (
                              <span className="italic text-gray-500"> Not available</span>
                            )}
                          </td>
                        </tr>
                        {dataReservationById.reservation.payment_date && (
                          <tr className="w-fit">
                            <td className="font-semibold whitespace-no-wrap">Payment Date</td>
                            <td className="font-normal">
                              {moment(dataReservationById.reservation.payment_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}
                            </td>
                          </tr>
                        )}
                        {dataReservationById.reservation.cancel_date && (
                          <tr className="w-fit">
                            <td className="font-semibold whitespace-no-wrap">Cancel Date</td>
                            <td className="font-normal">
                              {moment(dataReservationById.reservation.cancel_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}
                            </td>
                          </tr>
                        )}
                        {dataReservationById.reservation.status_id == 8 && (
                        <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">Account Refund</td>
                          <td className="font-normal">
                            {dataReservationById.reservation.account_refund}
                          </td>
                        </tr>
                      )}
                        {dataReservationById.reservation.refund_date && (
                          <tr className="w-fit">
                            <td className="font-semibold whitespace-no-wrap">refund Date</td>
                            <td className="font-normal">
                              {moment(dataReservationById.reservation.refund_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}
                            </td>
                          </tr>
                        )}
                        {dataReservationById.reservation.status_id == 10 && (
                          <tr className="w-fit">
                            <td className="font-semibold whitespace-no-wrap" colSpan={2}>
                              <div className="mb-4">
                                <label className="block mb-2">Image Refund Proof</label>
                                <div className="bg-gray-100 border-2 border-blue-500 border-dashed rounded-lg">
                                  <img className="p-8" src={`/photos/refund/${dataReservationById.reservation.proof_refund}`} alt='gallery_proof_refund' />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* {dataReservationById.reservation.payment_date != null && (
                      (() => {
                        // Calculate if today is within 3 days before the check-in date
                        const checkInDate = moment(dataReservationById.reservation.check_in);
                        const today = moment();
                        const daysDifference = checkInDate.diff(today, 'days');

                        // Button will be shown only if payment_date exists and is within 3 days before check-in
                        return daysDifference >= 3 ? (
                          <button
                            className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                            onClick={() => setRefundIsOpen(true)}
                          >
                            Refund
                          </button>
                        ) : null;
                      })()
                    )} */}
                    {(dataReservationById.reservation.payment_date != null &&
                      dataReservationById.reservation.cancel_date == null
                    ) && (
                      <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                        onClick={() => setRefundIsOpen(true)}>Cancel & Refund</button>
                    )}
                    {(dataReservationById.reservation.deposit_date != null &&
                      dataReservationById.reservation.payment_date == null &&
                      dataReservationById.reservation.cancel_date == null
                    ) && (
                      <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                        onClick={() => setRefundDepositIsOpen(true)}>Cancel & Refund</button>
                    )}
                    {(dataReservationById.reservation.deposit_date == null &&
                      dataReservationById.reservation.cancel_date == null) && (
                      <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                        onClick={() => setCancelIsOpen(true)}>Cancel
                      </button>
                    )}
                  </div>
                </AccordionSummary>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold mt-3">
                  Description
                </AccordionSummary>
                <AccordionDetails className="ml-2">
                  {dataReservationById.reservation.description}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold">
                  Activities
                </AccordionSummary>
                <AccordionDetails>
                  {dataActivity.map((accordionItem, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold">
                        Activity - Day {accordionItem.day}
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul>
                          {accordionItem.activities.map((activity: Activity, activityIndex: number) => (
                            <li key={activityIndex}>{activity.activity}. {activity.activity_name}</li>
                          ))}
                        </ul>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold">
                  Services
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="ml-2">
                    <li>
                      <p className="font-semibold">Service Include</p>
                      <ul className="ml-5">
                        {dataReservationById.service
                          .filter((item: { status: number; name: string }) => item.status === 1)
                          .map((service: { name: string }, index: number) => (
                            <li key={index} className="list-disc ml-2">{service.name}</li>
                          ))}
                      </ul>
                    </li>
                    <li>
                      <p className="font-semibold mt-5">Service Exclude</p>
                      <ul className="ml-5">
                        {dataReservationById.service
                          .filter((item: { status: number; name: string }) => item.status === 0)
                          .map((service: { name: string }, index: number) => (
                            <li key={index} className="list-disc ml-2">{service.name}</li>
                          ))}
                      </ul>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </div>
          )}
        </div>
        <div className="w-full h-full px-1 xl:w-1/2">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
            <h1 className="text-center text-xl font-bold">Reservation Homestay</h1>
            <table className="w3-table-all w3-hoverable w3-card-2">
              <thead>
                <tr>
                  <th className="w3-center">Homestay</th>
                  <th className="w3-center">Unit</th>
                  <th className="w3-center">Capacity</th>
                  <th className="w3-center">Price</th>
                </tr>
              </thead>
              <tbody >
              {dataBookedHomestay.map((homestay: { name:string, nama_unit:string, unit_number:string, capacity:number, price:number}) => (
              <tr key={homestay.unit_number} className="justify-center">
                <td className="w3-center">{homestay.name}</td>
                <td className="w3-center">{homestay.nama_unit}-{homestay.unit_number}</td>
                <td className="w3-center">{homestay.capacity}</td>
                <td className="w3-center">{rupiah(homestay.price)}</td>
              </tr>
            ))}
                <tr>
                  <th colSpan={2} className="text-left">Total Days</th>
                  <th colSpan={3} className="text-left">: {dataReservationById.reservation.max_day-1} Days</th>
                </tr>
                <tr>
                  <th colSpan={2} className="text-left">Total Price Homestay</th>
                  <th colSpan={3} className="text-left">: {rupiah(totalPriceHomestay)}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ReviewDialog isOpen={reviewIsOpen} setIsOpen={setReviewIsOpen} onSave={handleReviewSaved} />
        <EditReviewDialog isOpen={editReviewIsOpen} setIsOpen={setEditReviewIsOpen} onSave={handleReviewSaved} 
          data={{
            rating: dataReservationById.reservation.rating, 
            review: dataReservationById.reservation.review
          }}
        />
        <RefundDialog isOpen={refundIsOpen} setIsOpen={setRefundIsOpen} 
          onSave={refundOnSave} totalRefund={(totalPriceHomestay+dataReservationById.reservation.total_price)*0.5} />
        <RefundDepositDialog isOpen={refundDepositIsOpen} setIsOpen={setRefundDepositIsOpen} 
          onSave={refundOnSave} totalRefund={(dataReservationById.reservation.deposit)*0.5} />
        <CancelDialog isOpen={cancelIsOpen} setIsOpen={setCancelIsOpen} 
          onSave={cancelOnSave}/>
        <RefundConfirmationDialog isOpen={refundProofIsOpen} setIsOpen={setRefundProofIsOpen}
          onSave={refundConfirmationSave} gallery={dataReservationById.reservation.proof_refund} />
        <ToastContainer
          position="top-center"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    )
  }
  return (
    <div className="flex flex-col justify-center items-center py-5 bg-white rounded-lg m-5 px-5 shadow-lg">
      <h1 className="text-center text-xl font-bold">Loading Reservation Information</h1>
      <ClipLoader color="#36d7b7" speedMultiplier={3} className="my-28" />
    </div>
  )
}