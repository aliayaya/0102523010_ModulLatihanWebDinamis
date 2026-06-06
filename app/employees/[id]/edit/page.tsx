import { prisma } from '@/lib/prisma';
import EditEmployeeForm from './EditEmployeeForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Params = Promise<{ id: string }>;

export default async function EditEmployeePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const employeeId = parseInt(id);

  if (isNaN(employeeId)) {
    notFound();
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      skills: true,
      position: {
        include: { department: true },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  const departments = await prisma.department.findMany();
  const positions   = await prisma.position.findMany();
  const skills      = await prisma.skill.findMany();

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-[#fffafa]">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#fcebe9]">
          <Link
            href="/employees"
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#fcebe9] hover:bg-[#fffafa] text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-[#fb8f90] bg-clip-text text-transparent">
              Edit Data Karyawan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Mengubah informasi milik: <span className="font-semibold text-[#fb8f90]">{employee.name}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <EditEmployeeForm
          employee={{
            id: employee.id,
            name: employee.name,
            email: employee.email,
            gender: employee.gender,
            status: employee.status,
            photoPath: employee.photoPath,
            positionId: employee.positionId,
            position: { departmentId: employee.position.departmentId },
            skills: employee.skills.map((s) => ({ id: s.id })),
          }}
          departments={departments}
          positions={positions}
          skills={skills}
        />
      </div>
    </main>
  );
}
