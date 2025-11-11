import saveFile from "@/libs/utils/save-file";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    if (file == null || typeof file === "string") {
      return NextResponse.json({ message: "error" }, { status: 400 });
    }

    console.log("aqui");
    console.log(data);

    const [filePath] = await saveFile(file);

    return NextResponse.json({
      message: "success",
      filePath,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.error;
  }
}
