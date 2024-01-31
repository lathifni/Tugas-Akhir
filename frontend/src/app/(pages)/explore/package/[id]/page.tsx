'use client'

export default function PackageIdPage({ params }: any) {

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  return (
    <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
      <div className="w-full h-full px-1 lg:p-0 lg:mb-0 lg:mr-3 lg:w-7/12 ">
        <div className="py-5 bg-white rounded-lg mb-5 px-5">
          <h1 className="text-center text-xl font-semibold">Package Information</h1>
          <p>ini bagian rating bintangnya</p>
          <h1>ini pakai id {params.id} yahh halamannyya</h1>
          <table className="w-full md:ml-5 lg:">
            <tbody>
              <tr>
                <td className="font-semibold">Name</td>
                <td>: ini namanya</td>
              </tr>
              <tr>
                <td className="font-semibold">Package Type</td>
                <td>: ini namanya</td>
              </tr>
              <tr>
                <td className="font-semibold">Minimal Capacity</td>
                <td>: ini namanya</td>
              </tr>
              <tr>
                <td className="font-semibold">Contack Person</td>
                <td>: ini namanya</td>
              </tr>
              <tr>
                <td className="font-semibold">Price</td>
                <td>: ini namanya</td>
              </tr>
            </tbody>
          </table>
          <br />
          <h2 className="font-semibold">Description</h2>
          <p>paragrafnya</p>
          <br />
          <h2 className="font-semibold">Service Include</h2>
          <p>listnya</p>
          <br />
          <h2 className="font-semibold">Service Exclude</h2>
          <p>listnya</p>
          <div>
            
          </div>
        </div>
        <div className="py-5 bg-white rounded-lg mb-5 px-5">
          <h1 className="text-center text-xl font-semibold">Package Activity</h1>
        </div>
        <div className="py-5 bg-white rounded-lg mb-5 px-5">
          <h1 className="text-center text-xl font-semibold">Our Gallery</h1>
        </div>
        <div className=" py-5 bg-white rounded-lg mb-5 px-5">
          <h1 className="text-center text-xl font-semibold">Package Review</h1>
        </div>
      </div>
      <div className="py-5 flex flex-col lg:w-5/12 items-center bg-white rounded-lg">
        <h1 className="text-center text-xl font-semibold">Google Maps</h1>
      </div>
    </div>
  )
}