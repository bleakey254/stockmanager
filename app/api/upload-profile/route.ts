import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';  // CHANGE IF NEEDED
import { writeFile } from 'fs/promises';
import path from 'path';

// Define session type
interface Session {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    profilePic?: string | null;
  };
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions as any) as Session | null;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.formData();
  const file = data.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${session.user.id}_${Date.now()}_${file.name}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(filepath, buffer);

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  await prisma.user.update({
    where: { id: session.user.id },
    data: { profilePic: `/uploads/${filename}` },
  });

  return NextResponse.json({ success: true, url: `/uploads/${filename}` });
}