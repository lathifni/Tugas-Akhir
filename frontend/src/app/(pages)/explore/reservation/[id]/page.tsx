'use client'

import { fetchReservationById } from "@/app/(pages)/api/fetchers/reservation";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface Activity {
  day: string;
  activity: string;
  activity_name: string;
}

interface ReservationData {
  activity: Activity[];
}

export default function ReservationId({ params }: any) {
  const [dataActivity, setDataActivity] = useState<{ day: string; activities: Activity[] }[]>([]);

  const { data: dataReservationById, isLoading: loadingReservation } = useQuery({
    queryKey: ['reservationbyId', params.id],
    queryFn: () => fetchReservationById(params.id)
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

      setDataActivity(accordionContent);
    } catch (error) {
      console.log(error);
    }
  }, [dataReservationById])

  if (dataReservationById) {
    console.log(dataReservationById);
    return (
      <div className="flex flex-col xl:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 xl:w-1/2">
          {dataReservationById && (
            <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
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
                    <td className="font-normal">{new Date(dataReservationById.reservation.request_date).toDateString()}</td>
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
                    <td className="font-normal">{new Date(dataReservationById.reservation.check_in).toDateString()}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Check-out</td>
                    <td className="font-normal">
                      {(() => {
                        const checkInDate = new Date(dataReservationById.reservation.check_in);
                        const checkOutDate = new Date(checkInDate);
                        if (dataReservationById.reservation.max_day > 1) {
                          checkOutDate.setDate(checkOutDate.getDate() + dataReservationById.reservation.max_day - 1);
                          checkOutDate.setHours(12, 0, 0); // Set checkout time to 12:00 PM
                        } else {
                          checkOutDate.setHours(18, 0, 0); // Set checkout time to 6:00 PM
                        }
                        return `${checkOutDate.toDateString()}, ${checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Minimal Capacity</td>
                    <td className="font-normal">{dataReservationById.reservation.min_capacity} people</td>
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
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Price Total</td>
                    <td className="font-normal">{rupiah(dataReservationById.reservation.total_price)}
                      <span className="italic text-slate-600"> *Based on the activities and services added</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold mt-3">
                  Description
                </AccordionSummary>
                <AccordionDetails>
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
                  <ul>
                    <li>
                      <p className="font-semibold">Service Include</p>
                      <ul className="ml-5">
                        {dataReservationById.service
                          .filter((item: { status: number; name: string }) => item.status === 1)
                          .map((service: { name: string }, index: number) => (
                            <li key={index} className="list-disc">{service.name}</li>
                          ))}
                      </ul>
                    </li>
                    <li>
                      <p className="font-semibold mt-5">Service Exclude</p>
                      <ul className="ml-5">
                        {dataReservationById.service
                          .filter((item: { status: number; name: string }) => item.status === 0)
                          .map((service: { name: string }, index: number) => (
                            <li key={index} className="list-disc">{service.name}</li>
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
          </div>
        </div>
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