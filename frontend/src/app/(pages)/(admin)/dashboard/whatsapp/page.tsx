'use client'

import { generateQrCodeWA } from "@/app/(pages)/api/fetchers/chat"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {QRCodeSVG} from 'qrcode.react';

export default function WhatsApp () {
    const [dataQrCodeWA, setDataQrCodeWA] = useState(null)
    const { data, isLoading } = useQuery({
        queryKey: ['qrCodeWa'],
        queryFn: generateQrCodeWA
    })

    useEffect(() => {
        if(data != null || data !== undefined) {
            setDataQrCodeWA(data);
            console.log(data);
        }
      }, [data])

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
            <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
                <h1 className="text-2xl font-semibold text-center">Manage WhatsApp</h1>
                {dataQrCodeWA ? (
                    <QRCodeSVG  value={dataQrCodeWA} />
                ) : (
                    <p>No QR Code available</p>
                )}
            </div>
        </div>
    );
}