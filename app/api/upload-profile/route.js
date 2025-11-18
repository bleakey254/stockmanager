import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ← adjust path if different
import { prisma } from "@/lib/prisma";   // ← adjust if you have a prisma instance
import multer from "multer";
import path from "path";
import { writeFile } from "fs/promises";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ok = allowed.test(file.originalname.toLowerCase()) && allowed.test(file.mimetype);
    cb(null, ok);
  },
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("profileImage");

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name)}`;
    const filepath = `public/uploads/${filename}`;
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;

    await prisma.user.update({
      where: { email: session.user.email },
      data: { profileImage: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Important: disable body parser for file uploads
export const config = {
  api: { bodyParser: false },
};