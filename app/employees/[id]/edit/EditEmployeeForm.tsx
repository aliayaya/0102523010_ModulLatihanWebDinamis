'use client';

import { useState, useRef } from 'react';
import { updateEmployee } from '../../actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Department = { id: number; name: string };
type Position   = { id: number; name: string; departmentId: number };
type Skill      = { id: number; name: string };
type Employee   = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
  photoPath: string | null;
  positionId: number;
  position: { departmentId: number };
  skills: { id: number }[];
};

type Props = {
  employee: Employee;
  departments: Department[];
  positions:   Position[];
  skills:      Skill[];
};

export default function EditEmployeeForm({ employee, departments, positions, skills }: Props) {
  const router = useRouter();
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    employee.position.departmentId.toString()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Filter positions based on selected department
  const filteredPositions = positions.filter(
    (p) => p.departmentId === parseInt(selectedDeptId)
  );

  const employeeSkillIds = employee.skills.map((s) => s.id);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateEmployee(employee.id, formData);
      router.push('/employees');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat mengupdate data.');
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="custom-card p-6 sm:p-8 rounded-2xl bg-white space-y-6 animate-fadeIn"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-[#fcebe9]">
        <div className="w-10 h-10 bg-gradient-to-br from-[#fb8f90] to-[#f472b6] rounded-xl flex items-center justify-center shadow-md shadow-[#fb8f90]/10">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-wide uppercase">Edit Data Karyawan</h2>
          <p className="text-xs text-slate-400">Modifikasi informasi profil karyawan</p>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Foto Saat Ini */}
      {employee.photoPath && (
        <div className="flex items-center gap-4 p-4 bg-[#fffafa]/40 rounded-xl border border-[#fcebe9]">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#fcebe9] shadow-sm bg-white">
            <Image
              src={employee.photoPath}
              alt={employee.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Foto Profil Saat Ini</p>
            <p className="text-[10px] text-slate-400 mt-1">Upload foto baru di bawah jika ingin mengganti</p>
          </div>
        </div>
      )}

      {/* Grid Inputs for widescreen desktop layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Nama */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={employee.name}
            className="w-full custom-input rounded-xl px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Alamat Email
          </label>
          <input
            type="email"
            name="email"
            required
            defaultValue={employee.email}
            className="w-full custom-input rounded-xl px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
            Jenis Kelamin
          </label>
          <div className="flex gap-4 py-2">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                value="male"
                required
                defaultChecked={employee.gender === 'male'}
                className="w-4 h-4 text-[#fb8f90] border-[#fae1de] focus:ring-offset-0 focus:ring-1 focus:ring-[#fb8f90] cursor-pointer"
              />
              <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">Laki-laki</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                value="female"
                defaultChecked={employee.gender === 'female'}
                className="w-4 h-4 text-[#fb8f90] border-[#fae1de] focus:ring-offset-0 focus:ring-1 focus:ring-[#fb8f90] cursor-pointer"
              />
              <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">Perempuan</span>
            </label>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Status Karyawan
          </label>
          <select
            name="status"
            required
            defaultValue={employee.status}
            className="w-full custom-input rounded-xl px-3 py-2.5 text-sm focus:outline-none cursor-pointer"
          >
            <option value="">-- Pilih Status --</option>
            <option value="active">Aktif</option>
            <option value="probation">Masa Percobaan</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>

        {/* Departemen */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Departemen
          </label>
          <select
            name="departmentId"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full custom-input rounded-xl px-3 py-2.5 text-sm focus:outline-none cursor-pointer"
          >
            <option value="">-- Pilih Departemen --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Jabatan */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Jabatan
          </label>
          <select
            name="positionId"
            required
            defaultValue={employee.positionId}
            disabled={!selectedDeptId}
            className="w-full custom-input rounded-xl px-3 py-2.5 text-sm focus:outline-none cursor-pointer"
          >
            <option value="">
              {selectedDeptId ? '-- Pilih Jabatan --' : '(Pilih departemen)'}
            </option>
            {filteredPositions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Skills */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Kompetensi / Skill
          </label>
          <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#fffafa]/40 border border-[#fcebe9]/80 rounded-xl">
            {skills.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center gap-2 cursor-pointer p-0.5 group"
              >
                <input
                  type="checkbox"
                  name="skills"
                  value={skill.id}
                  defaultChecked={employeeSkillIds.includes(skill.id)}
                  className="w-4 h-4 text-[#fb8f90] border-[#fae1de] rounded focus:ring-offset-0 focus:ring-1 focus:ring-[#fb8f90] cursor-pointer"
                />
                <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">{skill.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ganti Foto Profil */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Ganti Foto Profil
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-[#fcebe9] file:text-xs file:font-semibold file:bg-[#fffafa] file:text-[#fb8f90] hover:file:bg-[#eedfdc] file:transition-colors file:cursor-pointer custom-input rounded-xl py-1.5 px-2"
          />
          <p className="text-[10px] text-slate-400 mt-2">Biarkan kosong jika tidak ingin merubah foto.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-[#fb8f90] to-[#f472b6] text-white py-2.5 px-4 rounded-xl text-sm font-bold hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-[#fb8f90]/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/employees')}
          className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 active:scale-[0.98] transition-all cursor-pointer"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
