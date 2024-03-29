'use client'

import MapHome from "@/components/maps/mapHome";
import { ChevronLeft, ChevronRight, Dot, Eye, Goal, MapPin } from "lucide-react";
import { fetchGalleriesGtp } from "../api/fetchers/galleries";
import { useQuery } from "@tanstack/react-query";
import { fetchInfoGtp } from "../api/fetchers/gtp";
import { Key, useEffect, useState } from "react";
import Footer from "@/components/footer";

interface UserLocation {
  lat: number;
  lng: number;
}

export default function Explore() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [goToObject, setGoToObject] = useState(false)
  const [showLegend, setShowLegend] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
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

  const [
    { isLoading: loadingGalleries, data: dataGalleries },
    { isLoading: loadingInfo, data: dataInfo }
  ] = queryMutiple()

  useEffect(() => {
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

  const fetchUserLocation = async (): Promise<void> => {
    try {
      const position = await getCurrentPosition();
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const goToObjectHandler = () => {
    setGoToObject(true)
  }

  const showLegendHandler = () => {
    setShowLegend((prev) => !prev); // Toggle nilai showLegend
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-3 mb-3 lg:p-0 lg:mb-0 lg:mr-3 lg:w-2/3 bg-white rounded-lg">
          <div className="flex flex-col ml-10 sm:m-1 md:flex-row h-auto select-none">
            <div className=" flex items-center">
              <h1 className="text-lg font-semibold md:ml-3">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap m-2 gap-5">
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600" title="Current Location" role="button" onClick={fetchUserLocation}>
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600" title="Toggle Legend" role="button" onClick={showLegendHandler}>
                <Eye className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white" title="Toggle Legend" role="button" onClick={goToObjectHandler}>Go to Object</div>
            </div>
          </div>
          <div className="pb-5 md:mx-3">
            <MapHome userLocation={userLocation} 
            goToObject={goToObject} setGoToObject={setGoToObject} 
            showLegend={showLegend} 
            />
          </div>
        </div>
        <div className="py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
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
      <Footer/>
    </>
  )
}