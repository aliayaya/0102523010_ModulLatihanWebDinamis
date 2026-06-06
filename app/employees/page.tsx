import { prisma } from '@/lib/prisma';
import AddEmployeeModal from './AddEmployeeModal';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import DeleteButton from './DeleteButton';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const PER_PAGE = 5;

type SearchParams = Promise<{
  search?: string;
  status?: string;
  page?: string;
}>;

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';
  const page = parseInt(params.page || '1');

  // Ambil semua data master untuk form
  const departments = await prisma.department.findMany();
  const positions   = await prisma.position.findMany();
  const skills      = await prisma.skill.findMany();

  // Stats Karyawan untuk info singkat
  const statTotal = await prisma.employee.count();
  const statActive = await prisma.employee.count({ where: { status: 'active' } });

  // Build where clause untuk search & filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (search) {
    where.name = { contains: search };
  }
  if (status) {
    where.status = status;
  }

  // Hitung total untuk pagination
  const totalCount = await prisma.employee.count({ where });
  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  // Ambil data karyawan dengan relasi + pagination
  const employees = await prisma.employee.findMany({
    where,
    include: {
      skills: true,
      position: {
        include: {
          department: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  return (
    <main className="min-h-screen bg-[#fffafa] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#fcebe9]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#fb8f90] to-[#f472b6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fb8f90]/10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                Manajemen Karyawan
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Kelola data karyawan perusahaan Anda secara mandiri</p>
            </div>
          </div>
          
          {/* Add Employee Modal Trigger */}
          <div className="flex items-center">
            <AddEmployeeModal
              departments={departments}
              positions={positions}
              skills={skills}
            />
          </div>
        </div>

        {/* Search and Filters */}
        <Suspense fallback={null}>
          <SearchFilter />
        </Suspense>

        {/* Data Table Card */}
        <div className="custom-card bg-white rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#fcebe9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-800 tracking-wide uppercase">
                Data Karyawan
              </h2>
              <span className="bg-[#fff0f0] text-[#e06a6b] text-xs px-2.5 py-1 rounded-full font-bold border border-[#fddbd9]">
                {totalCount} total
              </span>
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              Aktif: {statActive} / {statTotal}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fffafa]/70 text-slate-500 uppercase text-xs tracking-wider border-b border-[#fcebe9]">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Foto</th>
                  <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Nama &amp; Email</th>
                  <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Gender</th>
                  <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Jabatan &amp; Dept.</th>
                  <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Skill</th>
                  <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-right whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fcebe9]/40">
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 bg-white">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2 2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-semibold">Karyawan tidak ditemukan</p>
                        <p className="text-slate-400 text-xs">Coba ganti filter atau cari nama lain</p>
                      </div>
                    </td>
                  </tr>
                )}
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#fffafa]/60 transition-colors bg-white">
                    {/* Foto */}
                    <td className="px-5 py-4">
                      {emp.photoPath ? (
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#fcebe9] shadow-sm bg-[#fffafa]">
                          <Image
                            src={emp.photoPath}
                            alt={emp.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fff0f0] to-[#fff5f5] flex items-center justify-center text-[#fb8f90] text-sm font-bold border border-[#fddbd9] shadow-sm">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Nama & Email */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900 tracking-wide">{emp.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{emp.email}</p>
                    </td>

                    {/* Gender */}
                    <td className="px-5 py-4 text-slate-600 text-xs">
                      {emp.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </td>

                    {/* Jabatan & Departemen */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-700">{emp.position.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{emp.position.department.name}</p>
                    </td>

                    {/* Skill */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.length === 0 && (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                        {emp.skills.map((s) => (
                          <span
                            key={s.id}
                            className="bg-[#fffafa] text-slate-600 border border-[#fcebe9] text-[10px] px-2 py-0.5 rounded-full font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                        emp.status === 'active'    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'  :
                        emp.status === 'probation' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                     'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {emp.status === 'active'    ? '● Aktif'            :
                         emp.status === 'probation' ? '◐ Percobaan'   : '○ Tidak Aktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          href={`/employees/${emp.id}/edit`}
                          className="text-[#fb8f90] hover:text-[#e06a6b] hover:bg-[#fff0f0] border border-[#fcebe9] hover:border-[#fddbd9] px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 h-8 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <DeleteButton id={emp.id} name={emp.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#fcebe9] bg-[#fffafa]/40 flex items-center justify-between text-xs text-slate-500">
              <span>
                Halaman {currentPage} dari {totalPages} ({totalCount} data)
              </span>
              <Suspense fallback={null}>
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
