import path from "path";
import fs from "fs/promises";
import {  NextResponse } from "next/server";

export const POST = async (request: any) => {
  const formData = await request.formData();
  
  let category: string | undefined;
  const imagesUrl: string[] = [];
  const fileNames: string[] = [];

  for (const [name, value] of formData.entries()) {
    if (name === "category") category = value as string;
    else if (name.startsWith("imageDelete[")) {
      imagesUrl.push(value as string);
    }
  }

  for (let i = 0; i < imagesUrl.length; i++) {
    const url = imagesUrl[i];
    try {
      if (category) {
        const imagePath = path.join(process.cwd(), "public", "photos", category, url);
        await fs.unlink(imagePath);
      }
    } catch (error) {
      console.error(`Gagal menghapus file ${url}: ${error}`);
    }
  }
  return NextResponse.json({ msg: "delete image successfully", data: fileNames  }, { status: 200 });
};