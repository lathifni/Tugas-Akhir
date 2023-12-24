import Image from 'next/image'

export default function Home() {
  return (
    // <!DOCTYPE html>
<html lang="en">

<head>
    <meta charSet="utf-8" />
    <title>Desa Wisata</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="" name="keywords" />
    <meta content="" name="description" />

    {/* <!-- Favicon --> */}
    <link href="<?= base_url('media/icon/favicon.svg'); ?>" rel="icon" />

    {/* <!-- Google Web Fonts --> */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&family=Quicksand:wght@600;700&display=swap" rel="stylesheet" />

    {/* <!-- Icon Font Stylesheet --> */}
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />

    {/* <!-- Libraries Stylesheet --> */}
    <link href="<?= base_url('assets/lib/animate/animate.min.css'); ?>" rel="stylesheet" />
    <link href="<?= base_url('assets/lib/lightbox/css/lightbox.min.css'); ?>" rel="stylesheet" />
    <link href="<?= base_url('assets/lib/owlcarousel/assets/owl.carousel.min.css'); ?>" rel="stylesheet" />

    {/* <!-- Customized Bootstrap Stylesheet --> */}
    <link href="<?= base_url('css/landing-page/bootstrap.min.css'); ?>" rel="stylesheet" />

    {/* <!-- Template Stylesheet --> */}
    <link href="<?= base_url('css/landing-page/style.css'); ?>" rel="stylesheet" />
</head>

<body>

    {/* <!-- Spinner Start --> */}
    <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
    {/* <!-- Spinner End --> */}

    {/* <!-- Navbar Start --> */}
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top py-lg-0 px-4 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
        <a href="/" className="navbar-brand p-0">
            <img className="img-fluid me-3" src="<?= base_url('media/icon/logo.svg'); ?>" alt="Icon" />
            <h1 className="m-0 text-primary">Tourism Village</h1>
        </a>
        <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse py-4 py-lg-0" id="navbarCollapse">
            <div className="navbar-nav ms-auto">
                <a href="#home" className="nav-item nav-link active">Home</a>
                {/* <!-- <a href="/web" className="nav-item nav-link">Explore</a> --> */}
                <a href="#about" className="nav-item nav-link">About</a>
                <a href="#award" className="nav-item nav-link">Award</a>
            </div>
            {/* <?php if (!logged_in()) : ?> */}
                <a href="<?= base_url('login'); ?>" className="btn btn-primary">Login</a>
            {/* <?php elseif(logged_in()) : ?> */}
                <div className="col-1">
                    {/* <?php if (logged_in()) : ?> */}
                        <div className="btn-group mb-1">
                            <div className="dropdown">
                                <a className="" role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <div className="avatar avatar-md">
                                        <img  src="<?= base_url('media/photos/user'); ?>/<?= user()->user_image; ?>" alt="Face 1" />
                                    </div>
                                </a>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" href="<?= base_url('web/profile'); ?>">My Profile</a>
                                    <a className="dropdown-item" href="<?= base_url('logout'); ?>">Log Out</a>
                                </div>
                            </div>
                        </div>
                    {/* <?php else : ?> */}
                        <a href="<?= base_url('login'); ?>" className="btn btn-primary">Login</a>
                    {/* <?php endif; ?> */}
                </div>
            {/* <?php endif; ?> */}
        </div>
    </nav>
    {/* <!-- Navbar End --> */}

    {/* <!-- Header Start --> */}
    <div className="container-fluid bg-dark p-0 mb-5" id="home">
        <div className="row g-0 flex-column-reverse flex-lg-row">
            <div className="col-lg-6 p-0 wow fadeIn" data-wow-delay="0.1s">
                <div className="header-bg h-100 d-flex flex-column justify-content-center p-5">
                    <h2 className="display-6 text-light mb-2">
                        Welcome to
                    </h2>
                    <h1 className="display-4 text-light mb-5">
                        Desa WisataGreen Talao Park(GTP) Ulakan
                    </h1>
                    <div className="d-flex align-items-center pt-4 animated slideInDown">
                        <a href="/web" className="btn btn-primary py-sm-3 px-3 px-sm-5 me-5">Explore</a>
                        {/* <!-- <a href="/web" className="btn btn-primary py-sm-3 px-3 px-sm-5 me-5"
                        // >Explore Ulakan</a
                        // > --> */}
                        <button type="button" className="btn-play" data-bs-toggle="modal" data-src="<?= base_url('media/videos/landing_page.mp4'); ?>" data-bs-target="#videoModal">
                            <span></span>
                        </button>
                        <h6 className="text-white m-0 ms-4 d-none d-sm-block">Watch Video</h6>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                <div className="owl-carousel header-carousel">
                    <div className="owl-carousel-item">
                        <img className="img-fluid" src="<?= base_url('media/photos/landing-page/carousel-1.jpg'); ?>" alt="" />
                    </div>
                    <div className="owl-carousel-item">
                        <img className="img-fluid" src="<?= base_url('media/photos/landing-page/carousel-2.jpg'); ?>" alt="" />
                    </div>
                    <div className="owl-carousel-item">
                        <img className="img-fluid" src="<?= base_url('media/photos/landing-page/carousel-3.jpg'); ?>" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Header End --> */}

    {/* <!-- Video Modal Start --> */}
    <div className="modal modal-video fade" id="videoModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content rounded-0">
                <div className="modal-header">
                    <h3 className="modal-title" id="exampleModalLabel">Video</h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {/* <!-- 16:9 aspect ratio --> */}
                    <div className="ratio ratio-16x9">
                        <video src="" className="embed-responsive-item" id="video" controls autoPlay>Sorry, your browser doesn't support embedded videos</video>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Video Modal End --> */}

    {/* <!-- About Start --> */}
    <div className="container-xxl py-5" id="about">
        <div className="container">
            <div className="row g-5">
                <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                    <p><span className="text-primary me-2">#</span>Welcome To Desa Wisata </p>
                    <h1 className="display-5 mb-4">
                        Why You Should Visit
                        Desa Wisata <span className="text-primary">GTP Ulakan</span>
                    </h1>
                    <p className="mb-4">
                        Nagari ulakan, secara geografis memiliki potensi alam pesisir pantai dengan estuarianya atau dalam bahasa lokal dinamai talao,
                        berhasil menyulap lahan tidur seluas 15 hektar menjadi sebuah destinasi desa wisata dengan konsep community based ecotourism.
                        Kawasan ini diberi nama Green Talao Park dengan mengusung tema ekowisata dan edukasi dengan keunikan daya tarik, berupa
                        tracking talao/mangrove sepanjang 1,8 km yang merupakan treking terpanjang di Sumatera Barat.
                        Tak hanya sebagai tempat rekreasi, Green Talao Park juga menyajikan berbagai event dan paket wisata,
                        mulai dari paket kearifan lokal, konservasi, landscape alam, wisata pulau serta wisata kuliner.
                        Selain itu, kawasan ini juga terintegrasi langsung dengan pusat pariwisata religi di sumatera barat melalui situs budaya non benda yang diberikan oleh pemerintah,
                        yaitu makam Syekh Burhanudin, seorang ulama besar penyiar agama islam di ranah minang dan kawasan Taman Wisata Pulau (TWP) Pieh.
                    </p>
                    <h5 className="mb-3">
                        <i className="far fa-check-circle text-primary me-3"></i>Wisata Alam
                    </h5>
                    <h5 className="mb-3">
                        <i className="far fa-check-circle text-primary me-3"></i>Wisata Budaya
                    </h5>
                    <h5 className="mb-3">
                        <i className="far fa-check-circle text-primary me-3"></i>Wisata Edukasi
                    </h5>
                    <h5 className="mb-3">
                        <i className="far fa-check-circle text-primary me-3"></i>Wisata Kuliner
                    </h5>
                    <a className="btn btn-primary py-3 px-5 mt-3" href="/web">Explore</a>
                </div>
                <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div className="img-border">
                        <img className="img-fluid right" src="<?= base_url('media/photos/landing-page/bg-about.jpg'); ?>" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- About End --> */}

    {/* <!-- Award Start --> */}
    <div className="container-xxl bg-primary facts my-5 py-5 wow fadeInUp" data-wow-delay="0.1s" id="award">
        <div className="container py-5">
            <div className="row g-4">
                <div className="col-md-4 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">
                    <img src="<?= base_url('media/photos/landing-page/trophy.png'); ?>" alt="" className="mb-3"/>
                    <h1 className="text-white mb-2" data-toggle="counter-up">300</h1>
                    <p className="text-white mb-0">Besar ADWI 2021</p>
                </div>
                <div className="col-md-4 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">
                    <img src="<?= base_url('media/photos/landing-page/trophy.png'); ?>" alt=""  className="mb-3"/>
                    <h1 className="text-white mb-2" data-toggle="counter-up">50</h1>
                    <p className="text-white mb-0">Besar ADWI 2022</p>
                </div>
                <div className="col-md-4 col-lg-4 text-center wow fadeIn" data-wow-delay="0.3s">
                    <img src="<?= base_url('media/photos/landing-page/trophy.png'); ?>" alt="" />
                    <h1 className="text-white mb-2" data-toggle="counter-up">1</h1>
                    <p className="text-white mb-0">Harapan I Kelembagaan ADWI 2022</p>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Award End --> */}

    {/* <!-- Footer Start --> */}
    <div className="container-fluid footer bg-dark text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-lg-9 col-md-6">
                    <h5 className="text-light mb-4">Address</h5>
                    <p className="mb-2">
                        <i className="fa fa-map-marker-alt me-3"></i>Nagari Ulakan, Ulakan Tapakis, Kabupaten Padang Pariaman, Sumatera Barat
                    </p>
                    <p className="mb-2">
                        <i className="fa fa-phone-alt me-3"></i>082383985824
                    </p>
                    <p className="mb-2">
                        <i className="fa fa-envelope me-3"></i>adikurniawan.gtp@gmail.com
                    </p>
                    <div className="d-flex pt-2">
                        <a className="btn btn-outline-light btn-social" href="https://www.instagram.com/Green_Talao_Park/"><i className="fab fa-instagram"></i></a>
                        <a className="btn btn-outline-light btn-social" href="https://web.facebook.com/Ekowisata%20dan%20edukasi%20Nagari%20Ulakan?_rdc=1&_rdr"><i className="fab fa-facebook-f"></i></a>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <h5 className="text-light mb-4">Links</h5>
                    <a className="btn btn-link" href="#home">Home</a>
                    {/* <!-- <a className="btn btn-link" href="/web">Explore</a> --> */}
                    <a className="btn btn-link" href="#about">About</a>
                    <a className="btn btn-link" href="#award">Award</a>
                    <a className="btn btn-link" href="<?= base_url('login'); ?>">Login</a>
                </div>
            </div>
        </div>
        <div className="container">
            <div className="copyright">
                <div className="row">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        &copy; <a className="border-bottom" href="#">Mutiara Raudhatul Jannah</a>. All
                        Right Reserved.
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Footer End --> */}

    {/* <!-- Back to Top --> */}
    <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>

    {/* <!-- JavaScript Libraries --> */}
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossOrigin="anonymous"></script>
    <script src="<?= base_url('assets/lib/wow/wow.min.js'); ?>"></script>
    <script src="<?= base_url('assets/lib/easing/easing.min.js'); ?>"></script>
    <script src="<?= base_url('assets/lib/waypoints/waypoints.min.js'); ?>"></script>
    <script src="<?= base_url('assets/lib/counterup/counterup.min.js'); ?>"></script>
    <script src="<?= base_url('assets/lib/owlcarousel/owl.carousel.min.js'); ?>"></script>
    <script src="<?= base_url('assets/lib/lightbox/js/lightbox.min.js'); ?>"></script>

    {/* <!-- Template Javascript --> */}
    <script src="<?= base_url('js/landing-page.js'); ?>"></script>
</body>

</html>
  )
}
