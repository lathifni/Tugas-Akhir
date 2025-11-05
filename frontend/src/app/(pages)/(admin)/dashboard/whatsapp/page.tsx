// 'use client'

// import { generateQrCodeWA } from "@/app/(pages)/api/fetchers/chat"
// import { useQuery } from "@tanstack/react-query"
// import { useEffect, useState } from "react"
// import {QRCodeSVG} from 'qrcode.react';

// export default function WhatsAppPage () {
//     const [dataQrCodeWA, setDataQrCodeWA] = useState(null)
//     const { data, isLoading } = useQuery({
//         queryKey: ['qrCodeWa'],
//         queryFn: generateQrCodeWA
//     })

//     useEffect(() => {
//         if(data != null || data !== undefined) {
//             setDataQrCodeWA(data);
//             console.log(data);
//         }
//       }, [data])

//     if (isLoading) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
//             <div className="w-full h-full flex flex-col justify-center items-center px-1 py-5 mb-3 bg-white rounded-lg">
//                 <h1 className="text-2xl font-semibold text-center">Manage WhatsApp QR Code</h1>
//                 {dataQrCodeWA ? (
//                     <QRCodeSVG 
//                         value={dataQrCodeWA} 
//                         size={256} // Mengubah ukuran QR code
//                     />
//                 ) : (
//                     <p>No QR Code available</p>
//                 )}
//             </div>
//         </div>
//     );
// }

'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

// Misal lokasi file: /app/(pages)/api/fetchers/chat.js
import { generateQrCodeWA } from '@/app/(pages)/api/fetchers/chat'

export default function WhatsAppPage() {
  const [statusWA, setStatusWA] = useState(null)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['qrCodeWa'],
    queryFn: generateQrCodeWA,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 menit
  })

  useEffect(() => {
    if (data && data.status) {
        console.log(data);
        
      setStatusWA(data.status)
    }
  }, [data])

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
        <div className="mt-2 spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-100 p-5 rounded-lg text-red-700">
        <h2 className="text-2xl font-semibold">Error</h2>
        <p>{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5 gap-5">
      {/* QR Code Card */}
      <div className="w-full max-w-md h-auto flex flex-col justify-center items-center px-1 py-5 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-4">WhatsApp Connection</h1>

        {/* Status UI Berdasarkan Status WA */}
        {statusWA === 'connected' ? (
          <div className="text-green-600 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p className="text-lg font-bold mt-2">Connected!</p>
            <p>Number: <strong>{data?.data?.number}</strong></p>
            <p>Name: <strong>{data?.data?.name || '-'}</strong></p>
          </div>
        ) : statusWA === 'waiting_for_qr' ? (
          <>
            <p className="text-yellow-600 font-medium mb-2">Please scan QC Code to login</p>
            <QRCodeSVG value={data.qr} size={256} />
            <p className="text-sm text-gray-500 mt-2">QR Code will change every refresh</p>
          </>
        ) : statusWA === 'initializing' ? (
          <div className="text-blue-600 text-center">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 mb-2"></div>
            <p className="font-medium">Connecting to WhatsApp...</p>
          </div>
        ) : (
          <p className="text-gray-500">Please try again</p>
        )}

        {/* Tombol Refresh Manual */}
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Refresh Status
        </button>
      </div>

      {/* Info Panel Tambahan (Opsional) */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-5 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Status Information</h2>
        {statusWA === 'connected' && (
          <div className="text-green-700">
            <p>Status: <span className="font-bold">Connected</span></p>
            <p>Number: {data?.data?.number || 'N/A'}</p> 
            <p>Name: {data?.data?.name || 'N/A'}</p>
          </div>
        )}
        {statusWA === 'waiting_for_qr' && (
          <div className="text-yellow-700">
            <p>Status: <span className="font-bold">Waiting Scan QR</span></p>
            <p>Please scan QR Code with your WhatsApp account to login.</p>
          </div>
        )}
        {statusWA === 'initializing' && (
          <div className="text-blue-700">
            <p>Status: <span className="font-bold">Starting WhatsApp Client</span></p>
            <p>Wait a minutes ...</p>
          </div>
        )}
      </div>
    </div>
  );
}