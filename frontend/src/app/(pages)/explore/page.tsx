'use client'

import Map from "@/components/maps/map";
import { ChevronLeft, ChevronRight, Dot, Eye, Goal, MapPin } from "lucide-react";
import { fetchGalleriesGtp } from "../api/fetchers/galleries";
import { useQuery } from "@tanstack/react-query";
import { fetchInfoGtp } from "../api/fetchers/gtp";
import { Key, useEffect, useState } from "react";
import MapCopy from "@/components/maps/mapEvent";

export default function Explore() {
  //   const { isError, isSuccess, isLoading, data, error } = useQuery({
  //     queryKey: ['galleriesGtp'],
  //     queryFn: fetchGalleriesGtp,
  //  })

  const queryMutiple = () => {
    const resGalleries = useQuery({
      queryKey: ['galleriesGtp'],
      queryFn: fetchGalleriesGtp,
    })
    const resInfo = useQuery({
      queryKey: ['infoGtp'],
      queryFn: fetchInfoGtp
    })
    return [resGalleries, resInfo]
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const [
    { isLoading: loadingGalleries, data: dataGalleries },
    { isLoading: loadingInfo, data: dataInfo }
  ] = queryMutiple()

  useEffect(() => {
    // Fungsi untuk mengganti slide setiap 3000ms
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % dataGalleries.length);
    }, 3000);

    // Membersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, [dataGalleries]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? dataGalleries.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === dataGalleries.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: any) => {
    setCurrentIndex(slideIndex);
  };

  // console.log(dataGalleries[currentIndex].url)


  return (
    <>
      <div className="flex flex-col lg:flex-row mt-3">
        <div className="w-full ml-3 h-full p-2 lg:w-2/3 bg-white rounded-lg">
          <div className="flex flex-col md:flex-row h-auto ">
            <div className=" flex items-center">
              <h1 className="text-lg font-semibold">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap m-2 gap-5">
              <div className="p-2 bg-blue-500 rounded-lg" title="Current Location">
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Set Manual Location">
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Toggle Legend">
                <Eye className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg text-white" title="Toggle Legend">go to object</div>
            </div>
          </div>
          <div className=" pb-5">
            {/* <Map /> */}
            <MapCopy />
          </div>
        </div>
        <div className="mx-3 py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
          <div className="text-2xl text-center justify-center">
            <h1 className="">GTP Ulakan</h1>
          </div>
          <div className="w-full px-5">
            { dataGalleries && (
            <div className="relative h-96 lg:h-52 xl:h-80 2xl:h-96 ">
              <div
                style={{ backgroundImage: `url('/photos/gtp/${dataGalleries[currentIndex].url}')` }}
                className='w-full h-full rounded-xl bg-center bg-cover duration-500'
              ></div>
              <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                <ChevronLeft onClick={prevSlide} size={30} />
              </div>
              {/* Right Arrow */}
              <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                <ChevronRight onClick={nextSlide} size={30} />
              </div>
              <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2'>
                {dataGalleries.map((slide: any, slideIndex: Key | null | undefined) => (
                  <div
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`text-2xl cursor-pointer ${currentIndex === slideIndex ? 'text-gray-600' : 'text-gray-200'}`}
                  >
                    <Dot />
                  </div>
                ))}
              </div>
            </div>
            )}
            <div>
              {dataInfo && (
                <table>
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>{dataInfo.name}</td>
                    </tr>
                    <tr>
                      <td>Type of Tourism</td>
                      <td>{dataInfo.type_of_tourism}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>{dataInfo.address}</td>
                    </tr>
                    <tr>
                      <td>Open</td>
                      <td>{dataInfo.open}</td>
                    </tr>
                    <tr>
                      <td>Close</td>
                      <td>{dataInfo.close}</td>
                    </tr>
                    <tr>
                      <td>Ticket Price</td>
                      <td>Rp{dataInfo.ticket_price}</td>
                    </tr>
                    <tr>
                      <td>Contact Person</td>
                      <td>{dataInfo.contact_person}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}