'use client'

import { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import ReactPlayer from 'react-player';
import { ChevronLeft, ChevronRight, Dot, PlayCircle, Info, X, SearchCheck } from 'lucide-react'; 
import MapLandingPage from '@/components/maps/mapLandingPage';

const slides = [
    {
        url: '/landingPage/carousel-1.jpg',
        alt: 'Green Talao Park Gate',
        caption: 'Welcome to Green Talao Park! Step through these gates into a serene world of nature and tranquility. Lets discover the allure of Green Talao Park through its iconic gate, signaling an unforgettable escape into greenery.',
    },
    {
        url: '/landingPage/carousel-2.jpg',
        alt: 'Ecotourism & Education ',
        caption: `Discover Green Talao Park, where ecotourism meets education. Enjoy tranquil moments and lush green scenery aboard our tour boats, offering a unique learning experience in nature.
        At Green Talao Park, immerse yourself in a peaceful ecotourism journey. Our boat tours offer stunning views and an educational insight into the local ecosystem, perfect for all ages.
        Experience the best of both worlds at Green Talao Park: an idyllic ecotourism spot and a hub for environmental education. Glide through serene waters on our tour boats and connect with nature.`,
    },
    {
        url: '/landingPage/carousel-3.jpg',
        alt: 'Duck Boat',
        caption: `Experience the magic of Green Talao Park! Glide across the waters in our fun duck boats, then settle in to witness breathtaking sunsets painting the sky
        Create unforgettable memories at Green Talao Park. Enjoy a leisurely ride on a duck boat as the day winds down, followed by a spectacular sunset view.`,
    },
    {
        url: '/landingPage/carousel-4.jpg',
        alt: 'Maqam Syekh Burhanuddin',
        caption: `Makam Syekh Burhanudin is located in Ulakan, Padang Pariaman Regency. For his role in the struggle to spread Islam in West Sumatra, the grave of Sheikh Burhanuddin has received much attention from pilgrims, especially from members of the Syattariyah Order.
            Basapa is an annual tradition in the form of a pilgrimage to the grave of Sheikh Burhanuddin in Ulakan, Padang Pariaman Regency every 10th of the month of Shafar. Sheikh Burhanuddin died on the 10th of the month of shaffar 1111 H / 1691 AD, so the ritual of pilgrimage to this grave is called basapa (bershafar).
            This tradition consists of several series of processes such as alms, infaq, pilgrimage to the grave of Sheikh Burhanuddin, prayer, prayer, dhikr, tadarusan, sholawatam, shattariyah tarekat teachings, well water, kimo water, watering ampa stones, and taking grave sand. The series of processions are carried out to commemorate the services of Sheikh Burhanuddin in fighting for and developing Islam in Minangkabau.`
    },
    {
        url: '/landingPage/carousel-5.jpg',
        alt: 'Tracking Mangrove ',
        caption: `When visiting Ulakan GTP, visitors will be able to enjoy the natural beauty of the coast. The tour provides a 1.8-kilometer track that allows tourists to explore the beach and mangrove forest rich with flora and fauna typical of Ulakan. Please note that currently, the mangrove tracking track only covers a distance of about 700 meters as it is currently under construction.
        Mangroves, a type of plant that grows in tidal areas, provide a unique touch to the coastline. With their prominent breathing roots, known as pneumatophores, mangroves demonstrate their ability to adapt to soils that have low oxygen availability. Beach forest, tidal forest, brackish forest, or mangrove forest are terms that reflect the diversity of vegetation that mangroves possess.
        The role of mangroves is very important in maintaining the ecological balance of the environment around coastal waters. As natural biofilters, binding agents, and pollution traps, mangroves create an ideal environment for various types of organisms such as gastropods, detritus-eating crabs, and plankton-eating bivalves. The presence of mangroves in Ulakan GTP not only adds to the
        charm of natural tourism, but also supports the sustainability of the coastal water environment.`
    },
    {
        url: '/landingPage/carousel-7.jpg',
        alt: 'Tracking Mangrove ',
        caption: `When visiting Ulakan GTP, visitors will be able to enjoy the natural beauty of the coast. The tour provides a 1.8-kilometer track that allows tourists to explore the beach and mangrove forest rich with flora and fauna typical of Ulakan. Please note that currently, the mangrove tracking track only covers a distance of about 700 meters as it is currently under construction.
        Mangroves, a type of plant that grows in tidal areas, provide a unique touch to the coastline. With their prominent breathing roots, known as pneumatophores, mangroves demonstrate their ability to adapt to soils that have low oxygen availability. Beach forest, tidal forest, brackish forest, or mangrove forest are terms that reflect the diversity of vegetation that mangroves possess.
        The role of mangroves is very important in maintaining the ecological balance of the environment around coastal waters. As natural biofilters, binding agents, and pollution traps, mangroves create an ideal environment for various types of organisms such as gastropods, detritus-eating crabs, and plankton-eating bivalves. The presence of mangroves in Ulakan GTP not only adds to the
        charm of natural tourism, but also supports the sustainability of the coastal water environment.`
    },
    {
        url: '/landingPage/5.jpg',
        // url: '/landingPage/carousel-6.jpg',
        alt: 'Biodiversity',
        caption: `Explore the rich biodiversity of Green Talao Park! Wander through lush green landscapes and along the Talao trekking paths, where you can observe diverse bird species and aquatic life thriving in our vital mangrove conservation area.
        "Immerse yourself in nature's wonders at Green Talao Park. Our verdant surroundings, scenic Talao trekking routes, and dedicated mangrove conservation efforts provide a harmonious habitat for a wide array of fascinating birds and aquatic creatures.`
    },
    {
        url: '/landingPage/pulau-pieh.jpg',
        alt: 'Pieh Island',
        caption: `Pieh Islandand its surrounding areas offer marine potential and diversity of marine life that needs protection and can be developed as a marine tourism destination. The island is rich in coral reefs, unique underwater topography, diversity of reef fish, turtles, 
        and mangrove forests, as well as charming white sand beaches with clear sea water. The uniqueness of Pieh Island is also seen in the land area in the center of the island which is a swampland directly connected to the sea, providing a unique experience related to the tides. This potential can be used as the main attraction in developing an interesting natural aquarium for tourists.
        "Immerse yourself in nature's wonders at Green Talao Park. Our verdant surroundings, scenic Talao trekking routes, and dedicated mangrove conservation efforts provide a harmonious habitat for a wide array of fascinating birds and aquatic creatures.`
    },
    {
        url: '/landingPage/homestay.jpg',
        alt: 'Comfortable Homestay',
        caption: `Relax and unwind in our comfortable homestay, offering a cozy retreat after a day of exploring Green Talao Park and its beautiful surroundings.
        Experience local hospitality and comfort at our on-site homestay. It's the perfect base for your adventures in Padang Pariaman`
    },
    {
        url: '/landingPage/ulu-ambek.jpg',
        alt: 'Ulu Ambek',
        caption: `Ulu ambek is a Minangkabau performance art that depicts conflict or combat without direct physical contact between two combatants. The practice includes martial arts moves and attacks as well as musical performances, but metaphorically shows the role of the teacher or sheikh to his students, as well as wisdom and spiritual knowledge.
        Ulu ambek originated as a development in Pariaman, on the west coast of Minangkabau, under various names such as alo ambek, luambek, ulue ambek or ulu ambek, all of which describe fighting and performance during non-material acts. This practice is part of alek nagari, a ceremony or festival held for the inauguration of new leaders or other important cultural events, 
        including the nagari as guests. Alek Nagari is where ulu ambek is played, with the game as a battle arena and Janang leading it as a supervisor and overseen by a ninik mamak or head of the nagari.`
    },
    {
        url: '/landingPage/tambua-tansa.jpg',
        alt: 'Tambua Tansa',
        caption: `Tambua Tansa is a type of Minangkabau folk music of West Sumatra consisting of two musical instruments, namely Gandang Tambua and Gandang Tansa. In its performance, this instrument is played in groups continuously, consisting of 6 Gandang Tambua players and 1 Tansa player.
        Gandang Tambua is a wooden cylinder with two holes and is played by throwing it over the shoulder of a standing player, using two wooden tambu mallets. In contrast, the Tansa has a sideways appearance and only has one side of skin. The Minangkabau tribe as one of the ethnic 
        groups in Indonesia has a variety of traditional arts, one of which is Tambua Tansa music. The arts flourish and develop in the Pariaman area, becoming an important part of community life. Almost in all nagari of Padang Pariaman Regency or Pariaman City, Tambua Tansa art is popular and continues to be worked on in various cultural and religious events of the community.`
    },
    {
        url: '/landingPage/galombang.png',
        alt: 'Galombang Dance',
        caption: `Galombang dance is a traditional dance art that developed in various regions in West Sumatra Province, Indonesia, especially those related to Minangkabau culture. This musical performance is one of the highlights of a traditional Minang wedding, and is often a highlight.
        The name "galombang" itself comes from a Minangkabau term that refers to the word "wave" which describes the movements of the dancers that resemble the waves of the ocean type. Galombang dance is an important part of Minangkabau cultural heritage that is passed down from generation to generation in each region. It is best performed during ceremonies to welcome honored guests, 
        such as traditional leaders, dance teachers, and during wedding ceremonies.`
    },
];

export default function LandingPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [isInfoVisible, setInfoVisible] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // 2. BUAT FUNGSI UNTUK MENG-HANDLE KLIK PADA KATEGORI
    const handleCategoryClick = (category: string) => {
        // Jika klik kategori yang sama, sembunyikan peta. Jika beda, ganti kategori.
        setSelectedCategory(prev => (prev === category ? null : category));
    };

    useEffect(() => {
        // Fungsi untuk mengganti slide setiap 3000ms
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
        }, 15000);

        // Membersihkan interval saat komponen di-unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setInfoVisible(false); // Reset visibilitas info
    }, [currentIndex]);

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
             <div className="relative h-96 w-full lg:w-1/2 lg:h-screen rounded-xl bg-gradient-to-tr from-black via-gray-600 to-green-100" id="home">
                <img src="/landingPage/bg-header.jpg" className="absolute mix-blend-overlay rounded-xl object-cover h-full w-full" />
                <div className="row g-0 flex-col-reverse lg:h-full lg:flex-row ">
                    <div className="h-full flex flex-col justify-center p-5">
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
                            <button onClick={handleOpenModal}>
                                <PlayCircle className='ml-32 text-5xl animate-pulse animate h-14 w-14 bg-blue-500 rounded-full text-white' />
                            </button>
                            <Modal show={openModal} onClose={handleCloseModal} size="4xl" popup>
                                <Modal.Header />
                                    <Modal.Body>
                                        <div className="aspect-video"> {/* Ini trik agar video selalu 16:9 */}
                                            <ReactPlayer
                                                url='videos/landing_page.mp4'
                                                width="100%"
                                                height="100%"
                                                controls
                                                playing={openModal} // Otomatis play saat modal terbuka
                                            />
                                        </div>
                                    </Modal.Body>
                            </Modal>
                            <h6 className="text-white hidden sm:block ms-4 ml-">Watch Video</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full lg:w-1/2 px-1 lg:h-screen h-96 m-auto relative group' id="home">
                <div
                    style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                    className='w-full h-full rounded-xl bg-center bg-cover duration-500'
                >
                     {/* <div className="absolute inset-0 flex h-full w-full items-end rounded-xl bg-black bg-opacity-0 p-6 text-white transition-all duration-500 group-hover:bg-opacity-10">
                        <div className="transform-gpu py-16 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-12">
                            <h3 className="text-2xl font-bold">{slides[currentIndex].alt}</h3>
                            <p className="mt-2 text-sm">{slides[currentIndex].caption}</p>
                        </div>
                    </div> */}
                    {/* Tombol Info Trigger */}
                    <button
                        onClick={() => setInfoVisible(!isInfoVisible)}
                        className="absolute top-4 right-4 z-20 rounded-full bg-black/30 p-2 text-white transition-transform hover:bg-black/50 hover:scale-110"
                        aria-label="Tampilkan informasi"
                    >
                        <Info size={24} />
                    </button>
                    
                    {/* Panel Deskripsi (Logika diubah dari hover ke state 'isInfoVisible') */}
                    <div className={`
                        absolute inset-0 flex h-full w-full flex-col justify-end rounded-xl bg-black p-6 text-white
                        transition-all duration-500
                        ${isInfoVisible ? 'bg-opacity-70' : 'bg-opacity-0'}
                    `}>
                        <div className={`
                            transform-gpu transition-all duration-500 mb-20
                            ${isInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
                        `}>
                            {/* Tombol Close di dalam panel */}
                            <button 
                                onClick={() => setInfoVisible(false)} 
                                className="absolute top-4 right-4 z-30 rounded-full p-1 text-white/70 transition-colors hover:text-white"
                                aria-label="Tutup informasi"
                            >
                                <X size={28} />
                            </button>
                            <h3 className="text-3xl font-bold">{slides[currentIndex].alt}</h3>
                            <p className="mt-4 text-base max-h-80 overflow-y-auto pr-4 text-justify">{slides[currentIndex].caption}</p>
                        </div>
                    </div>
                </div>
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
           
            {/* <div className="w-full py-5 lg:mx-10 xl:mx-52 mt-5" id="about">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mx-4 col-span-1 lg:col-span-1">
                            <p className="font-semibold mb-2 text-slate-300"># Welcome to Desa Wisata </p>
                            <h1 className="font-semibold text-center text-2xl lg:text-5xl mb-4 text-slate-900">
                                Why You Should Visit Desa Wisata
                                <span className="font-semibold block text-blue-500">GTP Ulakan</span>
                            </h1>
                            <p className="mb-4 text-xs sm:text-base text-slate-700 text-justify">
                               Nestled in Nagari Ulakan, a land blessed with the natural potential of a coastal landscape and its estuary —locally known as talao— a remarkable transformation has taken place. An area of 15 hectares of once-idle land has been reborn as a premier tourist village destination, founded on the principles of community-based ecotourism.
                               This destination is proudly named Green Talao Park. It champions a theme of ecotourism and education, featuring a unique main attraction: a 1.8 km estuary and mangrove track, the longest of its kind in West Sumatra.
                               More than just a recreational spot, Green Talao Park offers a rich variety of events and tour packages. Visitors can immerse themselves in experiences centered on local wisdom, participate in conservation efforts, admire the natural landscape, go on island tours, or indulge in a culinary journey.
                               Furthermore, the park is seamlessly integrated with West Sumatras main religious tourism hub, connected to the revered tomb of Sheikh Burhanuddin—a great cleric instrumental in spreading Islam in the Minangkabau realm—and the stunning Pieh Island Marine Tourism Park (TWP).
                            </p>
                            <ul className="list-none mb-3 text-xs sm:text-lg">
                                <li className="mb-1 flex items-center cursor-pointer hover:text-blue-500" onClick={() => handleCategoryClick('Natural Tourism')}>
                                    <SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Natural Tourism
                                </li>
                                <li className="mb-1 flex items-center cursor-pointer hover:text-blue-500" onClick={() => handleCategoryClick('Culture')}>
                                    <SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Cultural Tourism
                                </li>
                                <li className="mb-1 flex items-center cursor-pointer hover:text-blue-500" onClick={() => handleCategoryClick('Education Tourism')}>
                                    <SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Education Tourism
                                </li>
                                <li className="mb-1 flex items-center cursor-pointer hover:text-blue-500" onClick={() => handleCategoryClick('Religion')}>
                                    <SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Religious Tourism
                                </li>
                                <li className="mb-1 flex items-center cursor-pointer hover:text-blue-500" onClick={() => handleCategoryClick('Culinary')}>
                                    <SearchCheck className="mr-4" style={{ color: 'blue', fontSize: '1.5em' }} />Culinary Tourism
                                </li>
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
                    {selectedCategory && (
                        <div className='py-8'>
                            <MapLandingPage selectedCategory={selectedCategory} />
                        </div>
                    )}
                </div>
            </div> */}
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