// import path from "path";
// import fs from "fs/promises";
// import { NextResponse } from "next/server";

// // PENTING UNTUK VIDEO: Menaikkan batas waktu eksekusi.
// // Serverless function di Vercel punya batas waktu (misal 10-60 detik).
// // Upload & proses video butuh waktu lebih lama.
// export const maxDuration = 90; // Durasi dalam detik (sesuaikan nilainya)

// export const POST = async (request: Request) => {
//   try {
//     const formData = await request.formData();
//     const category = formData.get("category") as string;
//     // Gunakan .getAll() untuk mengambil semua file dengan nama 'videos'
//     const videos = formData.getAll("videos") as File[];

//     if (!category || videos.length === 0) {
//       return NextResponse.json(
//         { msg: "Kategori dan video tidak boleh kosong." },
//         { status: 400 }
//       );
//     }

//     // Tentukan direktori tujuan
//     const uploadDir = path.join(process.cwd(), "public", "videos", category);
//     // Buat direktori jika belum ada, { recursive: true } membuatnya aman
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Proses semua video secara paralel menggunakan Promise.all
//     const fileNames = await Promise.all(
//       videos.map(async (file) => {
//         // Ambil buffer dari file (sebagai ArrayBuffer)
//         const buffer = await file.arrayBuffer();

//         // Buat nama file yang unik untuk menghindari konflik
//         const fileName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
//         const filePath = path.join(uploadDir, fileName);

//         // Tulis file ke disk menggunakan Uint8Array (Fix untuk error TypeScript)
//         await fs.writeFile(filePath, new Uint8Array(buffer));

//         return fileName;
//       })
//     );

//     return NextResponse.json(
//       { msg: "Video upload successfully", data: fileNames },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { msg: "Terjadi kesalahan pada server saat mengupload video." },
//       { status: 500 }
//     );
//   }
// };


// codingan lama
import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export const POST = async (request: any) => {
  const formData = await request.formData();
  let category: string | undefined;
  const video: File[] = [];
  const fileNames: string[] = [];

  for (const [name, value] of formData.entries()) {
    if (name === "category") category = value as string;
    else if (name.startsWith("videos[")) {
      video.push(value as File);      
    }
  }

  for (let i = 0; i < video.length; i++) {
    const file = video[i];
    // const buffer = await file.arrayBuffer();
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer); 
    const fileName = `${new Date().getTime()}_${file.name}`;

    try {
      await fs.readdir(
        path.join(process.cwd() + "/public", `/videos/${category}`)
      );
    } catch (error) {
      await fs.mkdir(
        path.join(process.cwd() + "/public", `/videos/${category}`)
      );
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      `videos/${category}`,
      fileName
    );

    // fs.writeFile(filePath, Buffer.from(buffer));
    await fs.writeFile(filePath, data);

    fileNames.push(fileName);
  }
  return NextResponse.json({ msg: "video upload successfully", data: fileNames  }, { status: 201 });
};