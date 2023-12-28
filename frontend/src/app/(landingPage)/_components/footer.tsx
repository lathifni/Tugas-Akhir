import { MailOpen, MapPin, Phone } from "lucide-react";

export default function FooterLandingPage() {
  return (
    <div className="w-full bg-gradient-to-tr from-black via-gray-800 to-black text-white mt-10 pt-5">
      <div className="py-5 w-full ">
        <div className="ml-10 xl:mx-52 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-1 md:col-span-1">
            <h5 className="text-white mb-4">Address</h5>
            <p className="mb-2 flex">
              <MapPin className="mr-3" style={{ fontSize: '1.8em' }} />
              Nagari Ulakan, Ulakan Tapakis, Kabupaten Padang Pariaman, Sumatera Barat
            </p>
            <p className="mb-2 flex">
              <Phone className="mr-3" style={{ fontSize: '1.5em' }} />
              082383985824
            </p>
            <p className="mb-2 flex">
              <MailOpen className="mr-3" style={{ fontSize: '1.5em' }} />
              adikurniawan.gtp@gmail.com
            </p>
            <div className="flex pt-2 space-x-3">
              <a href="https://www.instagram.com/Green_Talao_Park/">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://web.facebook.com/Ekowisata%20dan%20edukasi%20Nagari%20Ulakan?_rdc=1&_rdr">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1 md:ml-52">
            <h5 className="text-white mb-4">Links</h5>
            <ul className="list-disc list-inside">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#award">Award</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className=" w-full">
        <div className="row w-full">
          <div className="col-md-6 text-center">
            &copy; <a href="#">Lathif Nur Irsyad</a>. All Right Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}