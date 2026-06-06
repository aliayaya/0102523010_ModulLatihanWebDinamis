'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';

// ───────────────────────────────────────────
// ACTION: Tambah Karyawan Baru
// ───────────────────────────────────────────
export async function createEmployee(formData: FormData) {
  // 1. Ambil semua field dari form
  const name       = formData.get('name') as string;
  const email      = formData.get('email') as string;
  const gender     = formData.get('gender') as string;       // Radio button
  const status     = formData.get('status') as string;       // Dropdown biasa
  const positionId = parseInt(formData.get('positionId') as string); // Cascading dropdown
  const skillIds   = formData.getAll('skills') as string[];  // Checkbox (array)
  const photo      = formData.get('photo') as File;

  // Validasi email unique sebelum insert
  const existingEmployee = await prisma.employee.findUnique({
    where: { email },
  });
  if (existingEmployee) {
    throw new Error(`Email "${email}" sudah terdaftar. Gunakan email lain.`);
  }

  // 2. Handle upload foto
  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const bytes    = await photo.arrayBuffer();
    const buffer   = Buffer.from(bytes);
    const filename = `${Date.now()}-${photo.name.replace(/\s/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Pastikan folder uploads tersedia
    await mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    photoPath = `/uploads/${filename}`;
  }

  // 3. Simpan ke database
  await prisma.employee.create({
    data: {
      name,
      email,
      gender,
      status,
      positionId,
      photoPath,
      // Hubungkan Many-to-Many dengan Skill
      skills: {
        connect: skillIds.map((id) => ({ id: parseInt(id) })),
      },
    },
  });

  revalidatePath('/employees');
}

// ───────────────────────────────────────────
// ACTION: Update Karyawan
// ───────────────────────────────────────────
export async function updateEmployee(id: number, formData: FormData) {
  const name       = formData.get('name') as string;
  const email      = formData.get('email') as string;
  const gender     = formData.get('gender') as string;
  const status     = formData.get('status') as string;
  const positionId = parseInt(formData.get('positionId') as string);
  const skillIds   = formData.getAll('skills') as string[];
  const photo      = formData.get('photo') as File;

  // Validasi email unique (kecuali untuk karyawan yang sedang di-edit)
  const existingEmployee = await prisma.employee.findFirst({
    where: {
      email,
      NOT: { id },
    },
  });
  if (existingEmployee) {
    throw new Error(`Email "${email}" sudah digunakan oleh karyawan lain.`);
  }

  // Handle upload foto baru
  let photoPath: string | undefined = undefined;
  if (photo && photo.size > 0) {
    // Hapus foto lama jika ada
    const oldEmployee = await prisma.employee.findUnique({ where: { id } });
    if (oldEmployee?.photoPath) {
      try {
        const oldFilePath = path.join(process.cwd(), 'public', oldEmployee.photoPath);
        await unlink(oldFilePath);
      } catch {
        // Abaikan error jika file tidak ditemukan
      }
    }

    const bytes    = await photo.arrayBuffer();
    const buffer   = Buffer.from(bytes);
    const filename = `${Date.now()}-${photo.name.replace(/\s/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Pastikan folder uploads tersedia
    await mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    photoPath = `/uploads/${filename}`;
  }

  // Update ke database
  await prisma.employee.update({
    where: { id },
    data: {
      name,
      email,
      gender,
      status,
      positionId,
      ...(photoPath !== undefined && { photoPath }),
      // Disconnect semua skill lama, lalu connect yang baru
      skills: {
        set: [], // Hapus semua relasi skill lama
        connect: skillIds.map((sid) => ({ id: parseInt(sid) })),
      },
    },
  });

  revalidatePath('/employees');
}

// ───────────────────────────────────────────
// ACTION: Hapus Karyawan
// ───────────────────────────────────────────
export async function deleteEmployee(id: number) {
  // Hapus foto jika ada
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (employee?.photoPath) {
    try {
      const filePath = path.join(process.cwd(), 'public', employee.photoPath);
      await unlink(filePath);
    } catch {
      // Abaikan error jika file tidak ditemukan
    }
  }

  await prisma.employee.delete({ where: { id } });
  revalidatePath('/employees');
}
