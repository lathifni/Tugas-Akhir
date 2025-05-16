import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { fetchGalleriesGtp } from "../../api/fetchers/galleries";
import { useQuery } from "@tanstack/react-query";
import { fetchInfoGtp } from "../../api/fetchers/gtp";
import { useEffect, useState } from "react";

export default function GeneralInfo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isLoading: loadingGalleries, data: dataGalleries } = useQuery({
    queryKey: ['galleriesGtp'],
      queryFn: fetchGalleriesGtp,
  })
  const { isLoading: loadingInfo, data: dataInfo } = useQuery({
    queryKey: ['infoGtp'],
      queryFn: fetchInfoGtp
  })

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

  useEffect(() => {
    if (dataGalleries) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % dataGalleries.length);
      }, 3000);
      return () => clearInterval(interval);
    }
    // Membersihkan interval saat komponen di-unmount
  }, [dataGalleries]);
  
  return (
    <div className="flex flex-col py-1 lg:w-1/3 items-center bg-white rounded-lg">
      <div className="text-2xl text-center justify-center">
        <h1 className="text-2xl font-semibold">GTP Ulakan</h1>
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
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center '>
            {dataGalleries.map((galleryItem: { url: string }, index: number) => (
              <div
                key={index} // Menggunakan indeks sebagai kunci
                onClick={() => goToSlide(index)} // Menggunakan indeks untuk navigasi ke slide yang sesuai
                className={`cursor-pointer ${currentIndex === index ? 'text-gray-600' : 'text-gray-200'}`}
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
  )
}