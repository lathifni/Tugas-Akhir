import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Perhatikan tipe params di sini: { filename: string } BUKAN { path: string[] }
export async function GET(req: Request, { params }: { params: { filename: string } }) {
  
  // 1. Ambil params sesuai nama folder kamu [filename]
  const filename = params.filename; 

  if (!filename) {
    return new NextResponse('Filename not provided', { status: 400 });
  }

  // 2. Path join-nya GAK PERLU titik tiga (...) karena ini cuma satu string
  // Kita hardcode folder 'refund' di sini karena file ini ada di dalam folder refund
  const filePath = path.join(process.cwd(), 'public', 'photos', 'refund', filename);

  // 3. Cek file
  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  // 4. Baca file
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  let contentType = 'application/octet-stream';
  if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.pdf') contentType = 'application/pdf';

  return new NextResponse(fileBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=0, must-revalidate' 
    }
  });
}