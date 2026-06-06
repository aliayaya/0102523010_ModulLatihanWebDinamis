import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🧹 Membersihkan database lama...');
  // Hapus data lama untuk mencegah duplikasi ("kedoublean")
  await prisma.employee.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.position.deleteMany();
  await prisma.department.deleteMany();

  console.log('🌱 Melakukan seeding data baru...');

  // 1. Buat Department
  const deptTech = await prisma.department.create({ data: { name: 'Technology' } });
  const deptHR   = await prisma.department.create({ data: { name: 'Human Resource' } });

  // 2. Buat Position (sesuai Department — untuk Cascading Dropdown)
  await prisma.position.createMany({
    data: [
      { name: 'Frontend Developer', departmentId: deptTech.id },
      { name: 'Backend Developer',  departmentId: deptTech.id },
      { name: 'HR Generalist',      departmentId: deptHR.id  },
      { name: 'Recruitment Staff',  departmentId: deptHR.id  },
    ]
  });

  // 3. Buat Skill (untuk Checkbox)
  await prisma.skill.createMany({
    data: [
      { name: 'React.js'    },
      { name: 'Node.js'     },
      { name: 'MySQL'       },
      { name: 'UI/UX Design'},
    ]
  });

  console.log('✅ Seed berhasil!');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); });
