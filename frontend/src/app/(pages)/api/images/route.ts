// import path from "path";
// import fs from "fs/promises";
// import { NextResponse } from "next/server";

// // 1. HAPUS 'export const config'. Tidak lagi dibutuhkan di App Router.

// // 2. Gunakan tipe 'Request' yang benar dari bawaan web API
// export const POST = async (request: Request) => {
//   // 3. Bungkus semua logika dalam try...catch untuk error handling yang solid
//   try {
//     // 4. Gunakan .get() dan .getAll() untuk parsing FormData yang lebih rapi
//     const formData = await request.formData();
//     const category = formData.get("category") as string;
//     const images = formData.getAll("images") as File[];

//     // Validasi input dasar
//     if (!category || images.length === 0) {
//       return NextResponse.json(
//         { msg: "Kategori dan gambar tidak boleh kosong." },
//         { status: 400 }
//       );
//     }

//     // 5. Buat direktori tujuan SEKALI SAJA di luar loop, jika belum ada.
//     // `{ recursive: true }` akan membuat folder `photos` dan `category` jika belum ada.
//     const uploadDir = path.join(process.cwd(), "public", "photos", category);
//     await fs.mkdir(uploadDir, { recursive: true });

//     // 6. Gunakan Promise.all untuk memproses semua file secara PARALEL (lebih cepat)
//     const fileNames = await Promise.all(
//       images.map(async (file) => {
//         const buffer = await file.arrayBuffer();
//         // Membuat nama file unik
//         const fileName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
//         const filePath = path.join(uploadDir, fileName);

//         // 7. WAJIB 'await' saat menulis file menggunakan fs dari "fs/promises"
//         // await fs.writeFile(filePath, Buffer.from(buffer));
//         await fs.writeFile(filePath, new Uint8Array(buffer));

//         // Kembalikan nama file untuk dikumpulkan oleh Promise.all
//         return fileName;
//       })
//     );

//     return NextResponse.json(
//       { msg: "Image upload successfully", data: fileNames },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { msg: "Terjadi kesalahan pada server." },
//       { status: 500 }
//     );
//   }
// };



//ni codingan lama
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
  const images: File[] = [];
  const fileNames: string[] = [];

  for (const [name, value] of formData.entries()) {    
    if (name === "category") category = value as string;
    else if (name.startsWith("images[")) {
      images.push(value as File);         
    }
  }

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const arrayBuffer = await file.arrayBuffer();
    // const buffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer); 
    const fileName = `${new Date().getTime()}_${file.name}`;

    try {
      await fs.readdir(
        path.join(process.cwd() + "/public", `/photos/${category}`)
      );
    } catch (error) {
      await fs.mkdir(
        path.join(process.cwd() + "/public", `/photos/${category}`)
      );
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      `photos/${category}`,
      fileName
    );

    // fs.writeFile(filePath, Buffer.from(buffer));
    await fs.writeFile(filePath, data);

    fileNames.push(fileName);
  }
  return NextResponse.json({ msg: "image upload successfully", data: fileNames  }, { status: 201 });
};