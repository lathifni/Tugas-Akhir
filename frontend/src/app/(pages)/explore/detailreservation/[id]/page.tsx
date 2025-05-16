'use client'

import { bookingHomestayByIdReservation, fetchReservationById } from "@/app/(pages)/api/fetchers/reservation";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faCheck, faInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddUnitHomestayDialog from "./_components/addUnitHomestayDialog";
import GuideHomestayDialog from "./_components/guideHomestayDialog";
import { Bounce, ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import Reservation from "../../reservation/page";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Activity {
  day: string;
  activity: string;
  activity_name: string;
}

interface ReservationData {
  activity: Activity[];
}

interface ListHomestay {
  id: string;
  capacity: number;
  nama_unit: string;
  unit_type: string;
  price: number;
  unit_number: string;
  name: string;
}

export default function DetailReservationIdPage({ params }: any) {
  const [dataActivity, setDataActivity] = useState<{ day: string; activities: Activity[] }[]>([]);
  const [addHomestayDialog, setAddHomestayDialog] = useState(false)
  const [guideDialog, setGuideDialog] = useState(false)
  const [listHomestay, setListHomestay] = useState<ListHomestay[]>([])
  const [selectedHomestays, setSelectedHomestays] = useState<ListHomestay[]>([]);
  const [totalPriceHomestay, setTotalPriceHomestay] = useState(0)
  const router = useRouter();

  const { data: dataReservationById, isLoading: loadingReservation } = useQuery({
    queryKey: ['reservationbyId', params.id],
    queryFn: () => fetchReservationById(params.id),
    refetchOnWindowFocus: false
    // staleTime: 10000
  })
  
  const { mutateAsync: bookingHomestayByIdReservationMutation } = useMutation({
    mutationFn: bookingHomestayByIdReservation,
    onSuccess: () => {
      useQueryClient().invalidateQueries({ queryKey: ['bookingHomestayByIdReservation']})
    }
  })

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  useEffect(() => {
    try {
      if (dataReservationById) {
        const groupedData: { [key: string]: Activity[] } = {};
        dataReservationById.activity.forEach((activity: Activity) => {
          if (!groupedData[activity.day]) {
            groupedData[activity.day] = [];
          }
          groupedData[activity.day].push(activity);
        });

        const accordionContent = Object.entries(groupedData).map(([day, activities]: [string, Activity[]]) => ({
          day, activities: activities.sort((a, b) => parseInt(a.activity) - parseInt(b.activity))
        }));

        setDataActivity(accordionContent);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dataReservationById])

  const handleAddHomestay = (homestay: ListHomestay) => {
    const isDuplicate = selectedHomestays.some(selected => selected.unit_number === homestay.unit_number);    
    if (isDuplicate) return toast.warning('Already choosen')
    
    setSelectedHomestays([...selectedHomestays, homestay]);
    setListHomestay(listHomestay.filter(h => h.unit_number !== homestay.unit_number));
    const dayHomestay = dataReservationById.reservation.max_day-1
    const newTotalPrice = (totalPriceHomestay + homestay.price) * dayHomestay ;
    setTotalPriceHomestay(newTotalPrice);
    setAddHomestayDialog(false);
  };

  const handleRemoveHomestay = (unitNumberToRemove: string) => {
    const homestayToRemove = selectedHomestays.find(h => h.unit_number === unitNumberToRemove);
    if (!homestayToRemove) return;

    setSelectedHomestays(prev => prev.filter(h => h.unit_number !== unitNumberToRemove));
    const dayHomestay = dataReservationById.reservation.max_day - 1;
    const newTotalPrice = totalPriceHomestay - (homestayToRemove.price * dayHomestay);
    setTotalPriceHomestay(newTotalPrice);
  };

  const handleBookingHomestay = async() => {
    const data = {
      detailReservation: dataReservationById.reservation,
      selectedHomestays: selectedHomestays,
      totalPriceHomestay: totalPriceHomestay
    }
    // await bookingHomestayByIdReservationMutation(data)
    // return router.push(`/explore/reservation`);
    bookingHomestayByIdReservationMutation(data).then(() => {
      console.log("Booking completed!");
    }).catch((error) => {
      console.error("Booking failed", error);
    });
    return router.push(`/explore/reservation`);
  }

  if (dataReservationById) {    
    return (
      <div className="flex flex-col xl:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 xl:w-1/2">
          <AddUnitHomestayDialog isOpen={addHomestayDialog} setIsOpen={setAddHomestayDialog} 
          max_day={dataReservationById.reservation.max_day} checkin_date={dataReservationById.reservation.check_in}
          onAddHomestay={handleAddHomestay}
          />
          <GuideHomestayDialog isOpen={guideDialog} setIsOpen={setGuideDialog}/>
          {dataReservationById && (
            <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
              <div id="snap-container"></div>
              <h1 className="text-center text-xl font-bold">Reservation Package</h1>
              <table className="w-full mt-5 text-lg">
                <tbody>
                  <tr className="w-fit">
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Package Name</td>
                    <td className="font-normal">{dataReservationById.reservation.name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Package Type</td>
                    <td className="font-normal">{dataReservationById.reservation.type_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Request Date</td>
                    <td className="font-normal">{moment(dataReservationById.reservation.request_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Days Package</td>
                    {dataReservationById.reservation.max_day > 1 ? (
                      <td className="font-normal">{dataReservationById.reservation.max_day} Days</td>
                    ) :
                      <td className="font-normal">{dataReservationById.reservation.max_day} Day</td>}
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Check-in</td>
                    <td className="font-normal">{moment(dataReservationById.reservation.check_in).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Check-out</td>
                    <td className="font-normal">
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
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Total People</td>
                    <td className="font-normal">{dataReservationById.reservation.total_people} People</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Base Price Package</td>
                    <td className="font-normal">{rupiah(dataReservationById.reservation.price)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap ">Price Total</td>
                    <td className="font-normal">{rupiah(dataReservationById.reservation.total_price)}
                      <span className="italic text-slate-600"> *Based on the activities and services added</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold mt-4">
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
            <h1 className="text-center text-xl font-bold mb-5">Reservation Homestay</h1>
            <div className="flex gap-4">
              <button className="border border-blue-500 rounded-lg bg-white text-blue-500 px-3 py-2 hover:text-white hover:bg-blue-500" onClick={() => setAddHomestayDialog(!addHomestayDialog)}><FontAwesomeIcon icon={faAdd} /> Add Unit Homestay</button>
              <button className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700" onClick={() => setGuideDialog(!guideDialog)}><FontAwesomeIcon icon={faInfo} /> Read Guide</button>
            </div>
            <p>*This date is the day of the homestay reservation and the check out time is {(() => {
              const checkInDate = moment(dataReservationById.reservation.check_in);
              const checkOutDate = checkInDate.clone(); // Clone checkInDate to prevent mutation

              if (dataReservationById.reservation.max_day > 1) {
                checkOutDate.add(dataReservationById.reservation.max_day - 1, 'days').set({ hour: 12, minute: 0, second: 0 }); // Set checkout time to 12:00 PM
              } else {
                checkOutDate.set({ hour: 18, minute: 0, second: 0 }); // Set checkout time to 6:00 PM
              }
              return `${checkOutDate.format('dddd, Do MMMM  YYYY')}, ${checkOutDate.format('HH:mm')}`;
            })()} WIB
            </p>
            <table className="w3-table-all w3-hoverable w3-card-2">
              <thead>
                <tr>
                  <th className="w3-center">Homestay</th>
                  <th className="w3-center">Unit</th>
                  <th className="w3-center">Capacity</th>
                  <th className="w3-center">Price</th>
                  <th className="w3-center">Action</th>
                </tr>
              </thead>
              <tbody >
              {selectedHomestays.map(homestay => (
              <tr key={homestay.unit_number} className="justify-center">
                <td className="w3-center">{homestay.name}</td>
                <td className="w3-center">{homestay.nama_unit}-{homestay.unit_number}</td>
                <td className="w3-center">{homestay.capacity}</td>
                <td className="w3-center">{rupiah(homestay.price)}</td>
                <td className="text-red-500 w3-center">
                  <button className="hover:text-red-400" onClick={() => handleRemoveHomestay(homestay.unit_number)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
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
            <div className="flex justify-end gap-4 mt-4">
              <Link href={"/explore/reservation"}>
                <button type="button" className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700" >Continue Without Homestay</button>
              </Link>
              <button type="button" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={handleBookingHomestay}>
                <FontAwesomeIcon icon={faCheck}/> Save Booking Homestay
              </button>
            </div>
          </div>
        </div>
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