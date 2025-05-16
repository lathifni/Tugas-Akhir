'use client'

import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import { ChevronLeft, ChevronRight, Dot, PlayCircle, SearchCheck, XSquare } from 'lucide-react';

const slides = [
    {
        url: '/landingPage/carousel-1.jpg',
    },
    {
        url: '/landingPage/carousel-2.jpg',
    },
    {
        url: '/landingPage/carousel-3.jpg',
    },
    {
        url: '/landingPage/carousel-4.jpg',
    },
    {
        url: '/landingPage/carousel-5.jpg',
    },
    {
        url: '/landingPage/carousel-6.jpg',
    },
];

export default function LandingPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    Modal.setAppElement('#root');

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        // Fungsi untuk mengganti slide setiap 3000ms
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
        }, 3000);

        // Membersihkan interval saat komponen di-unmount
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: any) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className='relative flex flex-wrap justify-center items-center w-full'>
            <div className='w-full lg:w-1/2 px-1 lg:h-96 h-96 m-auto relative group' id="home">
                <div
                    style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                    className='w-full h-full rounded-xl bg-center bg-cover duration-500'
                ></div>
                {/* Left Arrow */}
                <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                    <ChevronLeft onClick={prevSlide} size={30} />
                </div>
                {/* Right Arrow */}
                <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                    <ChevronRight onClick={nextSlide} size={30} />
                </div>
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2'>
                    {slides.map((slide, slideIndex) => (
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
            <div className="relative h-96 w-full lg:w-1/2 lg:h-96 rounded-xl bg-gradient-to-tr from-black via-gray-600 to-green-100" id="home">
                <img src="/landingPage/bg-header.jpg" className="absolute mix-blend-overlay rounded-xl object-cover h-full w-full" />
                <div className="row g-0 flex-col-reverse lg:flex-row ">
                    <div className="h-full d-flex flex-col justify-center p-5">
                        <h2 className="text-white mb-2 text-2xl md:text-4xl">
                            Welcome to
                        </h2>
                        <h1 className="text-white mb-10 lg:mb-0 xl:mb-10 text-4xl md:text-6xl">
                            Desa Wisata<br />Green Talao Park<br />(GTP) Ulakan
                        </h1>
                        <div className="flex items-center pt-4" id="root">
                            <a href="/explore" className="absolute py-3 px-5 me-5 text-white rounded-sm bg-blue-500 hover:bg-green-400">
                                Explore
                            </a>
                            {/* <Link href="/explore">
                                <a className="absolute py-3 px-5 me-5 text-white rounded-sm bg-blue-500 hover:bg-green-400">
                                    Explore
                                </a>
                            </Link> */}
                            <button onClick={openModal}>
                                <PlayCircle className='ml-32 text-5xl animate-pulse animate h-14 w-14 bg-blue-500 rounded-full text-white' />
                            </button>
                            <Modal
                                isOpen={isOpen}
                                onRequestClose={closeModal}
                                contentLabel="Video Modal"
                            >
                                <button onClick={closeModal}>
                                    <XSquare className="text-5xl" style={{ color: 'red', fontSize: '2em' }} />
                                </button>
                                <div className="relative h-96 w-full max-w-screen-lg flex items-center justify-center">
                                    <ReactPlayer
                                        url='videos/landing_page.mp4'
                                        width="100%"
                                        height="100%"
                                        style={{ position: 'absolute', top: '80%', left: '65%', transform: 'translate(-50%, -50%)' }}
                                        controls
                                    />
                                </div>
                            </Modal>
                            <h6 className="text-white hidden sm:block ms-4 ml-">Watch Video</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full py-5 lg:mx-10 xl:mx-52 mt-5" id="about">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mx-4 col-span-1 lg:col-span-1">
                            <p className="font-semibold mb-2 text-slate-300"># Welcome to Desa Wisata </p>
                            <h1 className="font-semibold text-center text-2xl lg:text-5xl mb-4 text-slate-900">
                                Why You Should Visit Desa Wisata
                                <span className="font-semibold block text-blue-500">GTP Ulakan</span>
                            </h1>
                            <p className="mb-4 text-xs sm:text-base text-slate-700">
                                Nagari ulakan, secara geografis memiliki potensi alam pesisir pantai dengan estuarianya atau dalam bahasa lokal dinamai talao,
                                berhasil menyulap lahan tidur seluas 15 hektar menjadi sebuah destinasi desa wisata dengan konsep community based ecotourism.
                                Kawasan ini diberi nama Green Talao Park dengan mengusung tema ekowisata dan edukasi dengan keunikan daya tarik, berupa
                                tracking talao/mangrove sepanjang 1,8 km yang merupakan treking terpanjang di Sumatera Barat.
                                Tak hanya sebagai tempat rekreasi, Green Talao Park juga menyajikan berbagai event dan paket wisata,
                                mulai dari paket kearifan lokal, konservasi, landscape alam, wisata pulau serta wisata kuliner.
                                Selain itu, kawasan ini juga terintegrasi langsung dengan pusat pariwisata religi di sumatera barat melalui situs budaya non benda yang diberikan oleh pemerintah,
                                yaitu makam Syekh Burhanudin, seorang ulama besar penyiar agama islam di ranah minang dan kawasan Taman Wisata Pulau (TWP) Pieh.
                            </p>
                            <ul className="list-none mb-3 text-xs sm:text-lg">
                                <li className="mb-1 flex items-center"><SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Wisata Alam</li>
                                <li className="mb-1 flex items-center"><SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Wisata Budaya</li>
                                <li className="mb-1 flex items-center"><SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Wisata Edukasi</li>
                                <li className="mb-1 flex items-center"><SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Wisata Kuliner</li>
                            </ul>
                            <a className="bg-blue-500 hover:bg-green-400 text-white rounded-sm py-3 px-5 mt-3 inline-block" href="/explore">Explore</a>
                        </div>
                        <div className="h-96 lg:w-full lg:h-full mx-4 lg:mx-0 lg:py-20 col-span-1 lg:col-span-1">
                            <div className="w-full h-full relative">
                                <div className="absolute top-0 left-0 h-5/6 w-5/6 rounded-md border-4 border-blue-500"></div>
                                <img className="absolute bottom-0 right-0 h-5/6 w-5/6 rounded-md object-cover" src="/landingPage/bg-about.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" w-full relative rounded-xl bg-gradient-to-tr from-black to-gray-600 md:h-80 xl:mx-52 mt-5" id="award">
                <img src="/landingPage/bg-about.jpg" className="absolute mix-blend-overlay rounded-xl object-cover h-full w-full" />
                <div className="w-full py-5 h-full flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                        <div className="text-center ">
                            <img src="/landingPage/trophy.png" alt="" style={{ filter: 'invert(100%)', maxWidth: '4em' }} className="mb-3 mx-auto" />
                            <h1 className="text-white mb-2" data-toggle="counter-up">300</h1>
                            <p className="text-white mb-0 ">Besar ADWI 2021</p>
                        </div>
                        <div className="text-center ">
                            <img src="/landingPage/trophy.png" alt="" style={{ filter: 'invert(100%)', maxWidth: '4em' }} className="mb-3 mx-auto" />
                            <h1 className="text-white mb-2" data-toggle="counter-up">50</h1>
                            <p className="text-white mb-0">Besar ADWI 2022</p>
                        </div>
                        <div className="text-center ">
                            <img src="/landingPage/trophy.png" alt="" style={{ filter: 'invert(100%)', maxWidth: '4em' }} className="mb-3 mx-auto" />
                            <h1 className="text-white mb-2" data-toggle="counter-up">1</h1>
                            <p className="text-white mb-0">Harapan I Kelembagaan ADWI 2022</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
