import MapInput from "@/components/maps/mapInput";

export default function AddFacilityAdmin() {
  return (
    <>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-3 mb-4 lg:p-4 lg:mb-0 lg:mr-3 lg:w-5/12 bg-white rounded-lg">
          <h1 className="text-3xl text-center font-bold">Add Facility</h1>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Facility Name</label>
            <input type="text" name='name'
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Facility Type</label>
            <input type="text" name='name'
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Price</label>
            <input type="text" name='name'
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
        </div>
        <div className="w-full h-full py-5 lg:w-7/12 items-center bg-white rounded-lg">
          <h1 className="text-3xl text-center font-bold">Google Maps</h1>
          <div className="flex justify-around">
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Latitude</label>
              <input type="text" name='latutude'
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required placeholder="eg. -0.524313"/>
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Longitude</label>
              <input type="text" name='longitude'
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required placeholder="eg. 100.492351" />
            </div>
          </div>
          <div className="pb-5 md:mx-3">
            <MapInput />
          </div>
        </div>
      </div>
    </>
  )
}