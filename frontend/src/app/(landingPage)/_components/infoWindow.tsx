import { Info } from "lucide-react";

interface InfoWindowContentProps {
    id: string;
    name: string;
    type: string;
}

const InfoWindowContent: React.FC<InfoWindowContentProps> = ({ id, name, type }) => {

    // 1. Definisikan mapping khusus untuk ID Edukasi ke ID Paket
    const educationPackageIdMapping: { [key: string]: string } = {
        'A0017': 'P0001',
        'A0016': 'P0002',
        // Tambahkan mapping lain di sini jika ada paket baru
    };

    // 2. Logika URL yang diperbarui dengan 3 cabang kondisi
    let detailUrl = '';

    // Cabang 1: Cek apakah tipenya 'Education Tourism'
    if (type === 'Education Tourism') {
        const packageId = educationPackageIdMapping[id];
        // Pastikan ID-nya ada di dalam mapping kita sebelum membuat URL
        if (packageId) {
            detailUrl = `/explore/package/${packageId}`;
        }
    } 
    // Cabang 2: Jika bukan Edukasi, cek apakah tipenya 'Culinary'
    else if (type === 'Culinary') {
        detailUrl = `/explore/culinary/${id}`;
    } 
    // Cabang 3: Default untuk semua tipe lainnya (Natural, Culture, dll)
    else {
        detailUrl = `/explore/attraction/${id}`;
    }

    return (
        <div className="p-2 text-center w-48">
            <h1 className="font-semibold text-gray-800 text-base mb-3 truncate">{name}</h1>

            {/* 3. Render tombol HANYA jika detailUrl berhasil dibuat */}
            {detailUrl && (
                <a
                    href={detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Lihat Detail"
                    className="inline-flex items-center justify-center px-4 py-2 border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                >
                    <Info size={16} className="mr-2" />
                    <span>Info Detail</span>
                </a>
            )}
        </div>
    );
};

export default InfoWindowContent;