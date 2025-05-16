import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const buffer = await file.arrayBuffer();
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

    fs.writeFile(filePath, Buffer.from(buffer));

    fileNames.push(fileName);
  }
  return NextResponse.json({ msg: "image upload successfully", data: fileNames  }, { status: 201 });
};

// const readFile = (
//   req: NextApiRequest,
//   saveLocally?: boolean
// ): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
//   const options: formidable.Options = {};
//   if (saveLocally) {
//     options.uploadDir = path.join(process.cwd(), "/public/images");
//     options.filename = (name, ext, path, form) => {
//       return Date.now().toString() + "_" + path.originalFilename;
//     };
//   }
//   options.maxFileSize = 4000 * 1024 * 1024;
//   const form = formidable(options);
//   return new Promise((resolve, reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });
// };

// export const POST: NextApiHandler = async (req, res) => {
//   try {
//     await fs.readdir(path.join(process.cwd() + "/public", "/images"));
//   } catch (error) {
//     await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
//   }
//   await readFile(req, true);
//   res.json({ done: "ok" });
// };

// export async function POST(request: NextRequest) {
//   const data = await request.formData()
//   const file: File | null = data.get('file') as unknown as File
//   try {
//     await fs.readdir(path.join(process.cwd() + "/public", "/images"));
//   } catch (error) {
//     await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
//   }
//   // await readFile(data, true);
//   console.log(file);

//   NextResponse.json({ done: "ok" });
// }

// export default handler;